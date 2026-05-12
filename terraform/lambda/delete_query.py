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
    matrix_id = utils.get_query_string_parameters(event, 'id')
    matrix_ulid = utils.get_query_string_parameters(event, 'ulid')
    
    if not authorized:
        return utils.forbidden_response

    email = user_data['email']
    dynamodb_client.delete_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': f'USER_ID#{email}#MATRICES'},
            'SK1': {'S': f'MATRIX_ULID#{matrix_ulid}'}
        }
    )
    # dynamodb_client.delete_item(
    #     TableName=TABLE_NAME,
    #     Key={
    #         'PK1': {'S': 'MATRIX#MATRIX'},
    #         'SK1': {'S': f'MATRIX_ULID#{matrix_ulid}'}
    #     }
    # )

    response = {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Credentials" : True,
            "X-Requested-With": "*"
        },
        'body': json.dumps({'message':'Item Deleted!'}),
        #'input': json.dumps(event)
    }

    return response
