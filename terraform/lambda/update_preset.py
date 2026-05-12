import boto3
import os
import json

import utils

TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']
dynamodb_client = boto3.client('dynamodb')

authorized = False

def lambda_handler(event, context):
    global authorized
    preset_sequence = utils.get_query_string_parameters(event, 'sequence')
    display_setting = utils.get_query_string_parameters(event, 'display')
    print(f'preset_sequence: {preset_sequence}')
    print(f'display_setting: {display_setting}')
    
    user_data, authorized_status = utils.authorize_request(event)
    authorized = authorized_status
    if not authorized:
        return utils.forbidden_response
    email = user_data['email']
    
    default_hidden_sequences = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'SK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'},
            'PK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'}
        }
    )

    if 'Item' not in default_hidden_sequences:
        default_hidden_sequences = set()
    else:
        default_hidden_sequences = set(json.loads(default_hidden_sequences['Item']['SEQUENCES']['S']))
    if display_setting == 'true':
        default_hidden_sequences.discard(preset_sequence)
    else:
        default_hidden_sequences.add(preset_sequence)
    
    default_hidden_sequences = list(default_hidden_sequences)

    dynamodb_client.put_item(
        TableName=TABLE_NAME,
        Item={
            'SK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'},
            'PK1': {'S': f'USER_ID#{email}#DEFAULT_HIDDEN_SEQUENCES'},
            'SEQUENCES': {'S': json.dumps(default_hidden_sequences)}
        }
    )

    result = {
        'default_hidden_sequences': default_hidden_sequences,
    }

    stringified_result = json.dumps(result)
    return utils.get_success_response(stringified_result)
