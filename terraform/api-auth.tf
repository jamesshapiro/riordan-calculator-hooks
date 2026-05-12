# ---------------------------------------------------------------------------
# Auth API Gateway (Cognito JWT)
# Authorizes against the existing Cognito pool referenced via cognito_user_pool_id.
# Pool is NOT managed by this stack — referenced by ARN only.
# ---------------------------------------------------------------------------

resource "aws_api_gateway_rest_api" "auth" {
  name        = local.auth_api_name
  description = "Authenticated Riordan Calculator API"
}

resource "aws_api_gateway_authorizer" "cognito" {
  name          = "${local.auth_api_name}-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.auth.id
  provider_arns = [local.cognito_user_pool_arn]
}

resource "aws_api_gateway_resource" "auth" {
  for_each    = local.auth_resources
  rest_api_id = aws_api_gateway_rest_api.auth.id
  parent_id   = aws_api_gateway_rest_api.auth.root_resource_id
  path_part   = each.key
}

resource "aws_api_gateway_method" "auth" {
  for_each         = local.auth_map
  rest_api_id      = aws_api_gateway_rest_api.auth.id
  resource_id      = aws_api_gateway_resource.auth[split("#", each.key)[0]].id
  http_method      = each.value.method_type
  authorization    = "COGNITO_USER_POOLS"
  authorizer_id    = aws_api_gateway_authorizer.cognito.id
  api_key_required = false
}

resource "aws_api_gateway_integration" "auth" {
  for_each                = local.auth_map
  rest_api_id             = aws_api_gateway_rest_api.auth.id
  resource_id             = aws_api_gateway_resource.auth[split("#", each.key)[0]].id
  http_method             = aws_api_gateway_method.auth[each.key].http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.auth[each.key].invoke_arn
}

resource "aws_lambda_permission" "auth" {
  for_each      = local.auth_map
  statement_id  = "AllowAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.auth[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.auth.execution_arn}/*/*/*"
}

# --- CORS OPTIONS preflight ---

resource "aws_api_gateway_method" "auth_options" {
  for_each         = local.auth_resources
  rest_api_id      = aws_api_gateway_rest_api.auth.id
  resource_id      = aws_api_gateway_resource.auth[each.key].id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_method_response" "auth_options" {
  for_each        = local.auth_resources
  rest_api_id     = aws_api_gateway_rest_api.auth.id
  resource_id     = aws_api_gateway_resource.auth[each.key].id
  http_method     = "OPTIONS"
  status_code     = "200"
  response_models = { "application/json" = "Empty" }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.auth_options]
}

resource "aws_api_gateway_integration" "auth_options" {
  for_each             = local.auth_resources
  rest_api_id          = aws_api_gateway_rest_api.auth.id
  resource_id          = aws_api_gateway_resource.auth[each.key].id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates    = { "application/json" = "{\"statusCode\": 200}" }
  depends_on           = [aws_api_gateway_method.auth_options]
}

resource "aws_api_gateway_integration_response" "auth_options" {
  for_each    = local.auth_resources
  rest_api_id = aws_api_gateway_rest_api.auth.id
  resource_id = aws_api_gateway_resource.auth[each.key].id
  http_method = "OPTIONS"
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,GET,PUT,DELETE,PATCH,HEAD,TRACE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.auth_options]
}

# --- Deployment + stage ---

resource "aws_api_gateway_deployment" "auth" {
  rest_api_id = aws_api_gateway_rest_api.auth.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_method.auth,
      aws_api_gateway_integration.auth,
    ]))
  }

  depends_on = [
    aws_api_gateway_method.auth,
    aws_api_gateway_integration.auth,
    aws_api_gateway_integration.auth_options,
    aws_api_gateway_integration_response.auth_options,
    aws_api_gateway_gateway_response.auth_unauthorized,
    aws_api_gateway_gateway_response.auth_default_4xx,
    aws_api_gateway_gateway_response.auth_default_5xx,
  ]

  lifecycle { create_before_destroy = true }
}

resource "aws_api_gateway_stage" "auth" {
  deployment_id = aws_api_gateway_deployment.auth.id
  rest_api_id   = aws_api_gateway_rest_api.auth.id
  stage_name    = "dev"
}

# --- CORS on Cognito authorizer rejections ---

resource "aws_api_gateway_gateway_response" "auth_unauthorized" {
  rest_api_id   = aws_api_gateway_rest_api.auth.id
  response_type = "UNAUTHORIZED"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "auth_default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.auth.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_api_gateway_gateway_response" "auth_default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.auth.id
  response_type = "DEFAULT_5XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,DELETE,OPTIONS'"
  }
}

resource "aws_cloudwatch_log_group" "auth" {
  name              = "/aws/api_gw/${local.auth_api_name}"
  retention_in_days = 30
}
