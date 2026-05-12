import boto3
import os
import json
import utils

TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']
dynamodb_client = boto3.client('dynamodb')

authorized = False

def lambda_handler(event, context):
    global authorized
    user_data, authorized_status = utils.authorize_request(event)
    authorized = authorized_status
    
    if not authorized:
        return utils.forbidden_response

    email = user_data['email']
    body = json.loads(event['body'])
    
    title = body['title']
    
    result = dynamodb_client.delete_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': f'USER_ID#{email}#SEQUENCES'},
            'SK1': {'S': f'CUSTOM_SEQUENCE#{title}'},
        }
    )
    message = json.dumps(result)

    return utils.get_success_response(message)

