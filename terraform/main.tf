# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------

variable "aws_profile" {
  description = "Local AWS CLI profile to authenticate with. Leave empty to use env-var credentials (e.g. set by `assume`) or the default credential chain."
  type        = string
  default     = ""
}

variable "resource_scope" {
  description = "Prefix for all resource names. Single canonical stack: 'rc-prod'."
  type        = string
  default     = "rc-prod"
}

variable "cognito_user_pool_id" {
  description = "Existing Cognito user pool ID the auth API gateway authorizes against."
  type        = string
  default     = "us-east-1_yhdxywO4A"
}

variable "cognito_user_pool_client_id" {
  description = "Existing Cognito app client ID. Surfaced via outputs for the frontend."
  type        = string
  default     = "7n98lj1fda2au0rvmb6hg4ucau"
}

variable "sender_email" {
  description = "Verified SES identity used as From address by send_email Lambda."
  type        = string
  default     = "no-reply@riordancalculator.com"
}

# ---------------------------------------------------------------------------
# Locals
# ---------------------------------------------------------------------------

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  account_id       = data.aws_caller_identity.current.account_id
  region           = data.aws_region.current.name
  table_name       = "${var.resource_scope}-data"
  public_api_name  = "${var.resource_scope}-api"
  auth_api_name    = "${var.resource_scope}-auth-api"
  pandas_layer_arn = "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python312:6"

  cognito_user_pool_arn = "arn:aws:cognito-idp:${local.region}:${local.account_id}:userpool/${var.cognito_user_pool_id}"

  # --- Public API endpoints (no auth, API key required) ---
  public_resources = {
    "queries" = [
      { method_type = "PUT", function = "calculate_matrix" },
    ]
    "stats" = [
      { method_type = "GET", function = "get_stats" },
    ]
    "query" = [
      { method_type = "GET", function = "get_query" },
    ]
    "oeis" = [
      { method_type = "GET", function = "fetch_oeis_sequence" },
    ]
    "health" = [
      { method_type = "GET", function = "health" },
    ]
  }

  public_flat = flatten([
    for k, v in local.public_resources : [
      for i, m in v : {
        key         = "${k}#${i}"
        resource    = k
        method_type = m.method_type
        function    = m.function
      }
    ]
  ])
  public_map = { for r in local.public_flat : r.key => r }

  # --- Auth API endpoints (Cognito JWT) ---
  auth_resources = {
    "queries" = [
      { method_type = "PUT", function = "calculate_matrix" },
      { method_type = "GET", function = "get_queries" },
    ]
    "stats" = [
      { method_type = "GET", function = "get_stats" },
    ]
    "query" = [
      { method_type = "GET", function = "get_query" },
      { method_type = "PUT", function = "put_query_metadata" },
      { method_type = "DELETE", function = "delete_query" },
    ]
    "email" = [
      { method_type = "GET", function = "send_email" },
      { method_type = "PUT", function = "unsubscribe_email" },
    ]
    "oeis" = [
      { method_type = "GET", function = "fetch_oeis_sequence" },
    ]
    "sequence" = [
      { method_type = "GET", function = "get_sequences" },
      { method_type = "PUT", function = "put_sequences" },
      { method_type = "DELETE", function = "delete_sequence" },
    ]
    "preset" = [
      { method_type = "PUT", function = "update_preset" },
    ]
  }

  auth_flat = flatten([
    for k, v in local.auth_resources : [
      for i, m in v : {
        key         = "${k}#${i}"
        resource    = k
        method_type = m.method_type
        function    = m.function
      }
    ]
  ])
  auth_map = { for r in local.auth_flat : r.key => r }
}

# ---------------------------------------------------------------------------
# DynamoDB
# ---------------------------------------------------------------------------

resource "aws_dynamodb_table" "this" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK1"
  range_key    = "SK1"

  attribute {
    name = "PK1"
    type = "S"
  }

  attribute {
    name = "SK1"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# ---------------------------------------------------------------------------
# Lambda code archive (built by deploy.sh into .build/lambda/)
# ---------------------------------------------------------------------------

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/.build/lambda"
  output_path = "${path.module}/.build/lambda.zip"
}
