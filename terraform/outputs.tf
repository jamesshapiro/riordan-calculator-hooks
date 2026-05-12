output "public_api_url" {
  value = "https://${aws_api_gateway_rest_api.public.id}.execute-api.us-east-1.amazonaws.com/dev/"
}

output "public_api_key" {
  value     = aws_api_gateway_api_key.public.value
  sensitive = true
}

output "auth_api_url" {
  value = "https://${aws_api_gateway_rest_api.auth.id}.execute-api.us-east-1.amazonaws.com/dev/"
}

output "dynamodb_table" {
  value = aws_dynamodb_table.this.name
}

output "cognito_user_pool_id" {
  value = var.cognito_user_pool_id
}

output "cognito_user_pool_client_id" {
  value = var.cognito_user_pool_client_id
}

output "lambda_role_arn" {
  value = aws_iam_role.lambda.arn
}
