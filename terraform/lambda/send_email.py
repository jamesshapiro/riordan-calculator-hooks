import boto3
import os
import json
from datetime import datetime

import utils

TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']
SENDER_EMAIL = os.environ['SENDER_EMAIL']
dynamodb_client = boto3.client('dynamodb')
ses_client = boto3.client('ses')

authorized = False

def lambda_handler(event, context):
    global authorized
    user_data, authorized_status = utils.authorize_request(event)
    authorized = authorized_status
    
    if not authorized:
        return utils.forbidden_response
    
    given_name = user_data['given_name']
    family_name = user_data['family_name']
    
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    matrix_id = utils.get_query_string_parameters(event, 'id')
    recipient_email = utils.get_query_string_parameters(event, 'recipient')

    item = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': f'MATRIX_SHAREID#{matrix_id}'}
        }
    )['Item']

    matrix_data = json.loads(item['MATRIX_DATA']['S'])
    g_sequence_values = json.loads(item['G_SEQUENCE']['S'])
    f_sequence_values = json.loads(item['F_SEQUENCE']['S'])
    
    print(f'{matrix_data=}')
    riordan_group_elem = matrix_data['riordan group elem']
    

    riordan_html_table = '<table style="border: 1px solid black; border-collapse: collapse;"><tbody><tr>'

    rows = []
    cols = []

    for row_idx, _ in enumerate(riordan_group_elem):
        for col_idx, col in enumerate(riordan_group_elem[row_idx]):
            upper_triangular_styles='"border: 1px solid black; min-width: 30px;"'
            lower_triangular_styles='"border: 1px solid black; min-width: 30px; font-weight: bold; background-color: #F0DB8A;"'
            styles = lower_triangular_styles
            if col_idx > row_idx:
                styles=upper_triangular_styles
            cols.append(f'<td style={styles}>{col}</td>')
        rows.append(f'<tr>{"".join(cols)}</tr>')
        cols = []
    riordan_html_table += "".join(rows) + '</tbody></table>'
    sequence_template = '<p style="display: inline;">{}-sequence: <table style="display: inline; border-collapse: collapse;"><tbody><tr>{}</tr></tbody></table></p>'
    g_sequence = sequence_template.format('g', ''.join([f'<td style="border: 1px solid black; min-width: 30px; font-weight: bold; background-color: #B1F1B4;">{val}</td>' for val in g_sequence_values]))
    f_sequence = sequence_template.format('f', ''.join([f'<td style="border: 1px solid black; min-width: 30px; font-weight: bold; background-color: #B1F1B4;">{val}</td>' for val in f_sequence_values]))

    website = 'riordan-demo.weakerpotions.com'
    website = 'riordancalculator.com'

    ses_client.send_email(
        Source=f'Riordan Calculator <{SENDER_EMAIL}>',
        Destination={
            'ToAddresses': [recipient_email]
        },
        Message={
            'Subject': {
                'Data': f'Riordan Group Shared With You ({given_name} {family_name}) ({timestamp})'
            },
            'Body': {
                'Html': {
                    'Data': f'<html><body><h1>Riordan Group Element</h1><p>{given_name} {family_name} generated this Riordan Group on RiordanCalculator.com:</p><br>{g_sequence}<br>{f_sequence}<br>{riordan_html_table}<br><p>You can modify it, look up rows/columns in OEIS, view the inverse, Stieltjes, A-, B-, and Z-sequences and more by looking at the group directly on RiordanCalculator.com </p><p>Click <a href="{website}/?{matrix_id}">HERE</a> to interact with the Riordan Group on RiordanCalculator.com</p><p>Hopefully you find it interesting!</p></body></html>'
                },
            }
        }
    )

    message = json.dumps({'message': 'success!'})
    return utils.get_success_response(message)
