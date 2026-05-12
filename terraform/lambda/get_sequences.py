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

    default_sequences = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'SK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'},
            'PK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'}
        }
    )

    if 'Item' not in default_sequences:
        default_sequences = {}
    else:
        default_sequences = default_sequences['Item']
        default_sequences = json.loads(default_sequences['SEQUENCES']['S'])

    custom_sequences = dynamodb_client.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='PK1 = :pk1_val',
        ExpressionAttributeValues={
            ':pk1_val': {'S': f'USER_ID#{email}#SEQUENCES'}
        },
        ScanIndexForward=False,
    )

    if 'Items' not in custom_sequences:
        custom_sequences = {}
    elif len(custom_sequences['Items']) == 0:
        custom_sequences = {}
    else:
        custom_sequences = custom_sequences['Items']

    result = {
        'default_hidden_sequences': default_sequences,
        'custom_sequences': custom_sequences
    }

    stringified_result = json.dumps(result)
    response = utils.get_success_response(stringified_result)
    return response
