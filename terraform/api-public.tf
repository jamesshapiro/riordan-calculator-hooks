# ---------------------------------------------------------------------------
# Public API Gateway (no auth, API key required at usage-plan level)
# ---------------------------------------------------------------------------

resource "aws_api_gateway_rest_api" "public" {
  name        = local.public_api_name
  description = "Public Riordan Calculator API"
}

resource "aws_api_gateway_resource" "public" {
  for_each    = local.public_resources
  rest_api_id = aws_api_gateway_rest_api.public.id
  parent_id   = aws_api_gateway_rest_api.public.root_resource_id
  path_part   = each.key
}

resource "aws_api_gateway_method" "public" {
  for_each         = local.public_map
  rest_api_id      = aws_api_gateway_rest_api.public.id
  resource_id      = aws_api_gateway_resource.public[split("#", each.key)[0]].id
  http_method      = each.value.method_type
  authorization    = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_integration" "public" {
  for_each                = local.public_map
  rest_api_id             = aws_api_gateway_rest_api.public.id
  resource_id             = aws_api_gateway_resource.public[split("#", each.key)[0]].id
  http_method             = aws_api_gateway_method.public[each.key].http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.public[each.key].invoke_arn
}

resource "aws_lambda_permission" "public" {
  for_each      = local.public_map
  statement_id  = "AllowAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.public[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.public.execution_arn}/*/*/*"
}

# --- CORS OPTIONS preflight ---

resource "aws_api_gateway_method" "public_options" {
  for_each         = local.public_resources
  rest_api_id      = aws_api_gateway_rest_api.public.id
  resource_id      = aws_api_gateway_resource.public[each.key].id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

resource "aws_api_gateway_method_response" "public_options" {
  for_each        = local.public_resources
  rest_api_id     = aws_api_gateway_rest_api.public.id
  resource_id     = aws_api_gateway_resource.public[each.key].id
  http_method     = "OPTIONS"
  status_code     = "200"
  response_models = { "application/json" = "Empty" }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.public_options]
}

resource "aws_api_gateway_integration" "public_options" {
  for_each             = local.public_resources
  rest_api_id          = aws_api_gateway_rest_api.public.id
  resource_id          = aws_api_gateway_resource.public[each.key].id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates    = { "application/json" = "{\"statusCode\": 200}" }
  depends_on           = [aws_api_gateway_method.public_options]
}

resource "aws_api_gateway_integration_response" "public_options" {
  for_each    = local.public_resources
  rest_api_id = aws_api_gateway_rest_api.public.id
  resource_id = aws_api_gateway_resource.public[each.key].id
  http_method = "OPTIONS"
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,GET,PUT,DELETE,PATCH,HEAD,TRACE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.public_options]
}

# --- Deployment + stage ---

resource "aws_api_gateway_deployment" "public" {
  rest_api_id = aws_api_gateway_rest_api.public.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_method.public,
      aws_api_gateway_integration.public,
    ]))
  }

  depends_on = [
    aws_api_gateway_method.public,
    aws_api_gateway_integration.public,
    aws_api_gateway_integration.public_options,
    aws_api_gateway_integration_response.public_options,
  ]

  lifecycle { create_before_destroy = true }
}

resource "aws_api_gateway_stage" "public" {
  deployment_id = aws_api_gateway_deployment.public.id
  rest_api_id   = aws_api_gateway_rest_api.public.id
  stage_name    = "dev"
}

resource "aws_api_gateway_api_key" "public" {
  name = "${local.public_api_name}-key"
}

resource "aws_api_gateway_usage_plan" "public" {
  name = "${local.public_api_name}-usage-plan"
  api_stages {
    api_id = aws_api_gateway_rest_api.public.id
    stage  = aws_api_gateway_stage.public.stage_name
  }
}

resource "aws_api_gateway_usage_plan_key" "public" {
  key_id        = aws_api_gateway_api_key.public.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.public.id
}

resource "aws_cloudwatch_log_group" "public" {
  name              = "/aws/api_gw/${local.public_api_name}"
  retention_in_days = 30
}
