# ---------------------------------------------------------------------------
# Public API Lambda functions
# ---------------------------------------------------------------------------

resource "aws_lambda_function" "public" {
  for_each = local.public_map

  function_name    = "${local.public_api_name}-${each.value.function}"
  role             = aws_iam_role.lambda.arn
  handler          = "${each.value.function}.lambda_handler"
  runtime          = "python3.12"
  memory_size      = 2048
  timeout          = 150
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  layers = [local.pandas_layer_arn]

  environment {
    variables = {
      RIORDAN_CALCULATOR_DDB_TABLE = aws_dynamodb_table.this.name
    }
  }
}

# ---------------------------------------------------------------------------
# Auth API Lambda functions
# ---------------------------------------------------------------------------

resource "aws_lambda_function" "auth" {
  for_each = local.auth_map

  function_name    = "${local.auth_api_name}-${each.value.function}"
  role             = aws_iam_role.lambda.arn
  handler          = "${each.value.function}.lambda_handler"
  runtime          = "python3.12"
  memory_size      = 2048
  timeout          = 150
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  layers = [local.pandas_layer_arn]

  environment {
    variables = {
      RIORDAN_CALCULATOR_DDB_TABLE = aws_dynamodb_table.this.name
      SENDER_EMAIL                 = var.sender_email
    }
  }
}
