import boto3
import os
import json

import utils

TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']
dynamodb_client = boto3.client('dynamodb')

authorized = False

def lambda_handler(event, context):
    global authorized
    #preset_sequence = utils.get_query_string_parameters(event, 'preset')
    #display_setting = utils.get_query_string_parameters(event, 'display')
    
    user_data, authorized_status = utils.authorize_request(event)
    authorized = authorized_status
    if not authorized:
        return utils.forbidden_response
    email = user_data['email']
    
    matrix_id = utils.get_query_string_parameters(event, 'id')
    
    body = json.loads(event['body'])
    title = body['title']
    comment = body['comment']
    
    # TODO: check that matrix creator matches matrix ID from DDB
    item = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': f'MATRIX_SHAREID#{matrix_id}'}
        }
    )['Item']

    created_by = item['CREATED_BY']['S']
    if email != created_by:
        forbidden_message = json.dumps({'message': 'matrix metadata may only be edited by matrix creator'})
        return utils.get_forbidden_response(forbidden_message)
    
    update_expression = []
    expression_attribute_values = {}
    expression_attribute_names = {}

    if title != "" or (title == "" and comment == ""):
        update_expression.append("#TTT = :title")
        expression_attribute_values[':title'] = {'S': title}
        expression_attribute_names['#TTT'] = "TITLE"

    if comment != "" or (title == "" and comment == ""):
        update_expression.append("#CCC = :comment")
        expression_attribute_values[':comment'] = {'S': comment}
        expression_attribute_names['#CCC'] = "COMMENT"

    final_update_expression = "SET " + ", ".join(update_expression)

    item = dynamodb_client.update_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': f'MATRIX_SHAREID#{matrix_id}'}
        },
        UpdateExpression=final_update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values
    )

    item = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': f'MATRIX_SHAREID#{matrix_id}'}
        }
    )['Item']
    matrix_ulid = item['MATRIX_ULID']['S']

    item = dynamodb_client.update_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': f'USER_ID#{email}#MATRICES'},
            'SK1': {'S': f'MATRIX_ULID#{matrix_ulid}'}
        },
        UpdateExpression=final_update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values
    )
    message = json.dumps(item)
    return utils.get_success_response(message)
