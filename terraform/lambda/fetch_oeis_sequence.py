import boto3
import os
import json

import requests
from bs4 import BeautifulSoup

import utils

dynamodb_client = boto3.client('dynamodb')

authorized = False

def extract_sequence(url):
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, 'html.parser')

    seq_data_div = soup.find('div', class_='seqdata')
    if not seq_data_div:
        return None

    sequence_str = seq_data_div.text.strip()
    try:
        return [int(x.strip()) for x in sequence_str.split(',') if x.strip().isdigit()]
    except ValueError:
        return None

def lambda_handler(event, context):
    oeis_id = utils.get_query_string_parameters(event, 'oeis_id')
    
    table_name = os.environ["RIORDAN_CALCULATOR_DDB_TABLE"]
    pk = f"OEIS_SEQUENCE#{oeis_id}"
    
    try:
        response = dynamodb_client.get_item(
            TableName=table_name,
            Key={
                'PK1': {'S': pk},
                'SK1': {'S': pk}
            }
        )
        
        if 'Item' in response:
            numbers_str = response['Item']['NUMBERS']['S']
            result = json.loads(numbers_str)
            print(f'Cache hit for {oeis_id}: {result=}')
            message = json.dumps({'sequence': result})
            return utils.get_success_response(message)
    except Exception as e:
        print(f'DynamoDB lookup failed: {e}')
    
    url = f'https://oeis.org/{oeis_id}'
    result = extract_sequence(url)
    print(f'Cache miss for {oeis_id}: {result=}')
    message = json.dumps({'sequence': result})

    return utils.get_success_response(message)

