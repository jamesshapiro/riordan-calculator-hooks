import boto3
import os
import json

import utils

TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']
dynamodb_client = boto3.client('dynamodb')

def lambda_handler(event, context):
    matrix_id = utils.get_query_string_parameters(event, 'id')

    item = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': f'MATRIX_SHAREID#{matrix_id}'}
        }
    )['Item']

    message = json.dumps(item)
    return utils.get_success_response(message)
