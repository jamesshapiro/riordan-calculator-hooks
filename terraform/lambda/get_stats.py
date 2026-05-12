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
    
    overall = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'STATS#STATS'},
            'SK1': {'S': f'STATS#TOTAL_COMPUTED'}
        }
    )['Item']['COUNT']['S']

    result = {
        'overall': overall
    }

    if authorized:
        email = user_data['email']
        individual = dynamodb_client.get_item(
            TableName=TABLE_NAME,
            Key={
                'PK1': {'S': 'STATS#STATS'},
                'SK1': {'S': f'STATS#{email}#COMPUTED'}
            }
        )['Item']['COUNT']['S']
        result['individual'] = individual

    message = json.dumps(result)
    return utils.get_success_response(message)

