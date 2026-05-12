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

    # return the results in reverse order: most recent first
    scan_result = dynamodb_client.query(
        TableName=TABLE_NAME,
        KeyConditionExpression='PK1 = :pk1_val',
        ExpressionAttributeValues={
            ':pk1_val': {'S': f'USER_ID#{email}#MATRICES'}
        },
        ScanIndexForward=False,
    )

    message = json.dumps(scan_result)
    return utils.get_success_response(message)
