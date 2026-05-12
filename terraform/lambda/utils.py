import json

def get_query_string_parameters(event, param_name):
    query_string_parameters = event['queryStringParameters']
    param = query_string_parameters[param_name]
    return param

def authorize_request(event):
    request_context = event['requestContext']
    user_data = {}
    if 'authorizer' not in request_context:
        authorized = False
    elif 'claims' not in request_context['authorizer']:
        authorized = False
    elif 'email' not in request_context['authorizer']['claims']:
        authorized = False
    else:
        authorized = True
    if not authorized:
        return None, False
    user_data = {
        field: event['requestContext']['authorizer']['claims'][field] for field in event['requestContext']['authorizer']['claims']
    }
    return user_data, True

forbidden_response = {
    'statusCode': 403,
    'headers': {
        'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
        "Access-Control-Allow-Credentials" : True,
        "X-Requested-With": "*"
    },
    'body': json.dumps({'message':'Forbidden! Unauthorized!'}),
    #'input': json.dumps(event)
}

def get_success_response(message):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Credentials" : True,
            "X-Requested-With": "*"
        },
        'body': message,
    }

def get_forbidden_response(message):
    return {
        'statusCode': 403,
        'headers': {
            'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Credentials" : True,
            "X-Requested-With": "*"
        },
        'body': message,
    }