terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  # When aws_profile is set, TF reads from ~/.aws/config for that profile.
  # When empty (default), the standard credential chain runs — which honors
  # the AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY env vars that tools like
  # `assume` export. Setting profile and providing env vars together makes
  # the provider error out, so we only set it when explicitly requested.
  profile = var.aws_profile != "" ? var.aws_profile : null

  default_tags {
    tags = {
      Project   = "riordan-calculator"
      ManagedBy = "terraform"
      Stack     = var.resource_scope
    }
  }
}
