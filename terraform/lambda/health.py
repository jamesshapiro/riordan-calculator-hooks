import json

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
}

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'status': 'ok', 'engine': 'python-lambda'}),
    }
