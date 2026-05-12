#!/usr/bin/env python3 -tt

# handler.py

"""
#!/usr/bin/env python3 -tt
"""

import numpy as np
from numpy.linalg import inv
import math
import json
from functools import reduce
import boto3
import os
import ulid
import datetime

import utils

np.set_printoptions(precision=100)
np.set_printoptions(suppress=True)

authorized = False
mode = ''
metamode = ''
f_sequence_id = ''
g_sequence_id = ''
sequence_length = 0
    
dynamodb_client = boto3.client('dynamodb')
TABLE_NAME = os.environ['RIORDAN_CALCULATOR_DDB_TABLE']

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def generate_riordan_columns(M,g,f):
    for col in range(1, M.shape[1]):
        for row in range(M.shape[0]):
            riordan_cell = g[row]
            riordan_column = M[:,max(0,col-1)]
            riordan_cell = np.dot(riordan_column[:row+1], f[:row+1][::-1])
            M[row][col] = riordan_cell
    return M

def generate_exponential_riordan_columns(M,g,f):
    f = np.array(f)
    for col in range(1, M.shape[1]):
        for row in range(M.shape[0]):
            divisor = col
            riordan_cell = g[row]
            riordan_column = M[:,max(0,col-1)]
            r_numerators = [cell for cell in riordan_column]
            #print(f'{r_numerators=}')
            n_choose_k = [math.comb(row, i) for i in range(len(riordan_column))]
            #print(f'{n_choose_k}')
            r_numerators = [x*y for x,y in zip(r_numerators, n_choose_k)]
            #print(f'{r_numerators=}')
            f_numerators = [cell for cell in f]
            #print(f'{f_numerators=}')
            #r_denominators = [divisor for cell in riordan_column]
            #f_denominators = [1 for cell in f]
            numerators = np.multiply(r_numerators[:row+1], f_numerators[:row+1][::-1])
            #print(f'{numerators=}')
            #print(f'{divisor=}')
            #print(f'{sum(numerators)=} // {divisor=}')
            #denominators = np.multiply(r_denominators[:row+1], f_denominators[:row+1][::-1])
            #for i in range(len(numerators)):
            #prefix = np.prod(denominators[:i])
            #                suffix = np.prod(denominators[i+1:])
            #numerators[i] = numerators[i] * prefix * suffix
            #print(sum(numerators) // divisor)
            M[row][col] = sum(numerators) // divisor
        #print('='*20)
    return M

def generate_appel(g):
    f = [0] * len(g)
    f[1] = 1
    M = generate_riordan_group_element(g, f)
    #print(M)
    Mnbyn = np.delete(M, M.shape[0] - 1, 0)
    #print(np.matrix.round(inv(Mnbyn)))
    #print(get_A_sequence(M))
    #print(get_Z_sequence(M))

def generate_associated(f):
    g = [1] + [0] * (len(f) - 1)
    M = generate_riordan_group_element(g, f)

def generate_bell(g):
    f = [0] + g
    M = generate_riordan_group_element(g, f)
    #print(M)

def generate_derivative(f):
    g = f[1:]
    for i in range(1, len(g)+1):
        g[i-1] *= i
    M = generate_riordan_group_element(g, f)
    #print(M)

def generate_2_bell(g):
    g_squared = [0] * len(g)
    for i in range(len(g_squared)):
        g_squared[i] = np.dot(g[:i+1], g[:i+1][::-1])
    f = [0] + g_squared
    M = generate_riordan_group_element(g, f)
    #print(M)
    
def generate_riordan_group_element(g,f,n_by_n=False, discrete=True):
    min_length = min(len(g), len(f))
    f = f[:min_length]
    g = g[:min_length]
    numpy_g = np.array(g)
    numpy_f = np.array(f)
    m_dimensions = len(g)
    M = np.zeros((m_dimensions, m_dimensions-1))
    if discrete:
        M = np.zeros((m_dimensions, m_dimensions-1),dtype=np.int64)
    for i in range(m_dimensions-1):
        M[:,i] = numpy_g
    M = generate_riordan_columns(M,g,f)
    if n_by_n == True:
        M = np.delete(M, M.shape[0] - 1, 0)
    return np.matrix.round(M)

def generate_exponential_riordan_group_element(g,f,n_by_n=False, discrete=True):
    min_length = min(len(g), len(f))
    f = f[:min_length]
    g = g[:min_length]
    numpy_g = np.array(g)
    numpy_f = np.array(f)
    m_dimensions = len(g)
    M = np.zeros((m_dimensions, m_dimensions-1, 2))
    if discrete:
        M = np.zeros((m_dimensions, m_dimensions-1),dtype=np.int64)
    for i in range(m_dimensions-1):
        M[:,i] = numpy_g
    M = generate_exponential_riordan_columns(M,g,f)
    if n_by_n == True:
        M = np.delete(M, M.shape[0] - 1, 0)
    return np.matrix.round(M)

"""
def generate_exponential_generating_function(g,f,n_by_n=False, discrete=True):
    print('f: ', f)
    print('g: ', g)
    for i in range(len(f)):
        f[i] = [f[i], math.factorial(i)]
    for i in range(len(g)):
        g[i] = [g[i], math.factorial(i)]
    M = generate_exponential_riordan_group_element(g,f,n_by_n=n_by_n, discrete=discrete)
    for row in range(M.shape[0]):
        for column in range(M.shape[1]):
            M[row][column][0] *= math.factorial(row)
            M[row][column][0] /= math.factorial(column)
    M_final = np.zeros((M.shape[0], M.shape[1]))
    for row in range(M.shape[0]):
        for column in range(M.shape[1]):
            M_final[row][column] = M[row][column][0] / M[row][column][1]
    return np.matrix.round(M_final, 2)
"""

def generate_pseudo_involution(b, n=-1):
    if n == -1:
        n = 2 * len(b)
    A = np.identity(n)
    for diagonal_number in range(1,n):
        for row in range(diagonal_number,n):
            cell = 0
            _row = row
            _col = row - diagonal_number
            if _col > 0:
                cell += A[_row - 1, _col - 1]
            min_elem = min(min(len(b), _row), A.shape[1] - _col)
            for i in range(min_elem):
                cell += A[_row - 1 - i, _col +i] * b[i]
            A[_row,_col] = cell
    
    return np.matrix.round(A)

def generate_stieltjes(M, discrete=True):
    stieltjes = np.eye(1)
    if M.shape[0] > M.shape[1] + 1 or M.shape[0] < M.shape[1]:
        #print("argument to stieltjes generator must be an (n+1 x n)-matrix or an (n x n)-matrix")
        return
    elif M.shape[0] == M.shape[1]+1:
        Mnbyn = np.delete(M, M.shape[0] - 1, 0)
        M_inv = np.matrix.round(inv(Mnbyn)).astype(np.int64)
        M_minus_top = np.delete(M, 0, 0)
        stieltjes = np.matmul(M_inv, M_minus_top)
    else:
        M_inv, stieltjes = generate_stieltjes(np.delete(M, M.shape[1]-1, 1))
    if discrete:
        return M_inv, np.matrix.round(stieltjes).astype(np.int64)
    return M_inv, np.matrix.round(stieltjes)

def get_A_sequence(M):
    _, stieltjes = generate_stieltjes(M)
    a_seq = stieltjes[:,1]
    return list(map(int, a_seq))

def get_B_sequence(M):
    b_sequence = []
    for row_index in range(2, M.shape[0],2):
        #entry = M[row_index,0]
        entry = M[row_index,1]
        entry -= M[row_index - 1, 0]
        for i, b_entry in enumerate(b_sequence):
            entry -= b_entry * M[row_index - (1 + i), i + 1]
        next_b = entry // M[row_index - (1 + len(b_sequence)), 1+ len(b_sequence)]
        b_sequence.append(next_b)
    return list(map(int,b_sequence))

def get_Z_sequence(M):
    _, stieltjes = generate_stieltjes(M)
    return list(map(int,stieltjes[:,0]))

def is_pseudo_involution(_A):
    dims = list(_A.shape)
    A = _A
    if min(dims) < max(dims):
        A = np.delete(_A, _A.shape[0] - 1, 0)
    try:
        inv(A)
    except np.linalg.linalg.LinAlgError as e:
        #print(e)
        return False
    A_inv = np.matrix.round(inv(A))
    for row in range(A_inv.shape[0]):
        for col in range(A_inv.shape[1]):
            if (row + col) % 2 == 1:
                A_inv[row, col] *= -1
    A_inv = np.matrix.round(A_inv)
    return np.array_equal(A, A_inv)

def tweedle_right(g,f):
    M = generate_riordan_group_element(g,f)
    M_nbyn = np.delete(M, M.shape[0]-1, 0)
    n = M_nbyn.shape[0]
    i_star = np.diag(([1,-1]*n)[:n])
    result = reduce(np.dot, [M_nbyn, i_star, inv(M_nbyn), i_star])
    result = np.matrix.round(result)
    rows, columns = result.shape
    always_discrete = np.zeros((rows, columns),dtype=np.int64)
    for i in range(rows):
        for j in range(columns):
            always_discrete[i][j] = result[i][j]
    return np.matrix.round(always_discrete)

def tweedle_left(g,f):
    M = generate_riordan_group_element(g,f)
    M_nbyn = np.delete(M, M.shape[0]-1, 0)
    n = M_nbyn.shape[0]
    i_star = np.diag(([1,-1]*n)[:n])
    result = reduce(np.dot, [i_star, inv(M_nbyn), i_star, M_nbyn])
    result = np.matrix.round(result)
    rows, columns = result.shape
    always_discrete = np.zeros((rows, columns),dtype=np.int64)
    for i in range(rows):
        for j in range(columns):
            always_discrete[i][j] = result[i][j]
    return np.matrix.round(always_discrete)

def badRequest(message):
    responseCode = 400
    responseBody = {'feedback': message}
    response = {'statusCode': responseCode,
                'headers': {'x-custom-header' : 'custom-header'},
                'body': json.dumps(responseBody)}
    return response

def lambda_handler(event, context):
    global authorized
    global mode
    global metamode
    global f_sequence_id
    global g_sequence_id
    global sequence_length

    user_data, authorized_status = utils.authorize_request(event)
    authorized = authorized_status
    if authorized:
        email = user_data['email']
        first_name = user_data['given_name']
        last_name = user_data['family_name']

    body = json.loads(event['body'])
    g = body['g']
    f = body['f']
    
    if type(g) != list:
        g = list(map(int, g.split(',')))
    if type(f) != list:
        f = list(map(int, f.split(',')))
    
    mode = body['mode']
    metamode = body['metaMode']
    f_sequence_id = body['fSequenceId']
    g_sequence_id = body['gSequenceId']
    sequence_length = body['sequenceLength']
    
    M = generate_riordan_group_element(g,f)
    riordan_pseudo = is_pseudo_involution(M)
    M_inv, S = generate_stieltjes(M)
    a_seq = get_A_sequence(M)
    b_seq = get_B_sequence(M)
    z_seq = get_Z_sequence(M)
    tleft = tweedle_left(g,f)
    tleft_pseudo = is_pseudo_involution(tleft)
    tright = tweedle_right(g,f)
    tright_pseudo = is_pseudo_involution(tright)
    tweedle_left_a = get_A_sequence(tleft)
    tweedle_left_b = get_B_sequence(tleft)
    tweedle_left_z = get_Z_sequence(tleft)
    tweedle_right_a = get_A_sequence(tright)
    tweedle_right_b = get_B_sequence(tright)
    tweedle_right_z = get_Z_sequence(tright)
#    egf = generate_exponential_generating_function(g,f)
    erge = generate_exponential_riordan_group_element(g,f)
    M_exp_inv, exponentialstieltjes = generate_stieltjes(erge)
    # print(erge)
    two_bell = generate_2_bell(g)
#    deriv = generate_derivative(f)
#    bell = generate_bell(g)
#    associated = generate_associated(f)
#    appel = generate_appel(g)

    matrix_ulid = ulid.new().str
    ulid_last_10 = matrix_ulid[-10:]

    responseCode = 200
    result = json.dumps({
        'riordan group elem': M,
        'riordan group inverse': M_inv,
        'exp inverse': M_exp_inv,
        'riordan pseudo': riordan_pseudo,
        'a seq': a_seq,
        'b seq': b_seq,
        'z seq': z_seq,
        'stieltjes': S,
        'tweedle left': tleft,
        'tweedle left pseudo': tleft_pseudo,
        'tweedle right': tright,
        'tweedle right pseudo': tright_pseudo,
        'tweedle left a seq': tweedle_left_a,
        'tweedle left b seq': tweedle_left_b,
        'tweedle left z seq': tweedle_left_z,
        'tweedle right a seq': tweedle_right_a,
        'tweedle right b seq': tweedle_right_b,
        'tweedle right z seq': tweedle_right_z,
        'exponential': erge,
        'exponentialstieltjes': exponentialstieltjes,
        'shareid': ulid_last_10,
    }, cls=NumpyEncoder)
    #                         'exponential generating func': egf,
    #                         '2 bell': two_bell,
    #                         'derivative': deriv,
    #                         'bell': bell,
    #                         'associated': associated,
    #                         'appel': appel}

    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    item_data = {
        'MATRIX_ULID': {'S': matrix_ulid},
        'MATRIX_SHAREID': {'S': ulid_last_10},
        'MATRIX_DATA': {'S': result},
        'G_SEQUENCE': {'S': json.dumps(g)},
        'F_SEQUENCE': {'S': json.dumps(f)},
        'CREATED_AT': {'S': date},
        'MODE': {'S': mode},
        'METAMODE': {'S': metamode},
        'F_SEQUENCE_ID': {'S': f_sequence_id},
        'G_SEQUENCE_ID': {'S': g_sequence_id},
        'SEQUENCE_LENGTH': {'S': str(sequence_length)},
    }

    if authorized:
        item_data.update({
            'CREATED_BY': {'S': email},
            'CREATOR_NAME': {'S': f'{first_name} {last_name}'},
        
        })

    dynamodb_client.put_item(
        TableName=TABLE_NAME,
        Item={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': 'MATRIX_ULID#' + matrix_ulid},
            'MATRIX_SHAREID': {'S': ulid_last_10},
        }
    )
    dynamodb_client.put_item(
        TableName=TABLE_NAME,
        Item={
            'PK1': {'S': 'MATRIX#MATRIX'},
            'SK1': {'S': 'MATRIX_SHAREID#' + ulid_last_10},
            'MATRIX_ULID': {'S': matrix_ulid},
            # add item_data fields to this dictionary
            **item_data
        }
    )

    if authorized:
        dynamodb_client.put_item(
            TableName=TABLE_NAME,
            Item={
                'PK1': {'S': f'USER_ID#{email}#MATRICES'},
                'SK1': {'S': 'MATRIX_ULID#' + matrix_ulid},
                **item_data
            }
        )
        user_record = dynamodb_client.get_item(
            TableName=TABLE_NAME,
            Key={
                'PK1': {'S': 'STATS#STATS'},
                'SK1': {'S': f'STATS#{email}#COMPUTED'},
            }
        )
        updated_value = 0
        if 'Item' in user_record:
            current_value = int(user_record['Item']['COUNT']['S'])
            updated_value = current_value + 1
        dynamodb_client.put_item(
            TableName=TABLE_NAME,
            Item={
                'PK1': {'S': 'STATS#STATS'},
                'SK1': {'S': f'STATS#{email}#COMPUTED'},
                'COUNT': {'S': str(updated_value)}
            }
        )

    total_record = dynamodb_client.get_item(
        TableName=TABLE_NAME,
        Key={
            'PK1': {'S': 'STATS#STATS'},
            'SK1': {'S': 'STATS#TOTAL_COMPUTED'}
        }
    )

    updated_value = 0
    if 'Item' in total_record:
        current_value = int(total_record['Item']['COUNT']['S'])
        updated_value = current_value + 1
    dynamodb_client.put_item(
        TableName=TABLE_NAME,
        Item={
            'PK1': {'S': 'STATS#STATS'},
            'SK1': {'S': 'STATS#TOTAL_COMPUTED'},
            'COUNT': {'S': str(updated_value)}
        }
    )
    message = json.dumps(result)
    return utils.get_success_response(message)


#g = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
#f = [0,1,2,6,24,120]

#g = [1,0,1,0,3,0,15,0,105,0]
#f = [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]

#erge = generate_exponential_riordan_group_element(g,f)


"""
g = [1,1,2,5    ,14,42,132]
f = [0,1,1,2,5,14,42,132]
M = generate_riordan_group_element(g, f)
tleft = tweedle_left(g, f)
is_pseudo = is_pseudo_involution(tleft)
"""

"""
g = [1,1,2,5,14,42,132]
f = [0,1,3,9,28,90,297]
M = generate_riordan_group_element(g,f)
print(is_pseudo_involution(M))
get_B_sequence(M)

g = [1,1,2,5,14,42,132]
f = [0,1,2,5,14,43,132]
M = generate_riordan_group_element(g,f)
print(is_pseudo_involution(M))
"""

"""
g = [1,1,2,5,14,42,132,429]
f = [0,1,1,2,5,14,42,132]
M = generate_riordan_group_element(g,f)
a_seq = get_A_sequence(M)
b_seq = get_B_sequence(M)
"""


"""
tleft = tweedle_left(g,f)
print('tweedle left matrix:')
print(tleft)
tright = tweedle_right(g,f)
print('tweedle right matrix:')
print(tright)
"""


"""
payload = {'g': '1,1,2,5,14,42,132,429',
           'f': '0,1,1,2,5,14,42,132,429'}
data = json.dumps(payload)
event = {"body": data}
context = None
print(lambda_handler(event, context))
"""

"""
g = "1,1,1,1,1,1,1"
f = "0,1,0,0,0,0,0,0,0,0"
g = list(map(int, g.split(',')))
f = list(map(int, f.split(',')))
M = generate_exponential_generating_function(g,f,discrete=False)
print(M)
"""


# import boto3
# import os
# import json

# TABLE_NAME = os.environ["RIORDAN_CALCULATOR_DDB_TABLE"]

# def lambda_handler(event, context):
#     dynamodb_client = boto3.client('dynamodb')
#     dynamodb_client.put_item(
#         TableName=TABLE_NAME,
#         Item={
#             'PK1': {'S': 'Hello'},
#             'SK1': {'S': 'World'},
#             'info': {'S': 'Hello, World'}
#         }
#     )

#     s3_client = boto3.client('s3')
#     s3_client.put_object(Bucket='api-gateway-demo-cors-test.weakerpotions.com', Key='emptyfile', Body=b'')
#     return {
#         'statusCode': 200,
#         'body': json.dumps({'Result': 'Hello World Put Request!'}),
#         'headers': {
#             'Access-Control-Allow-Origin': '*',
#         }
#     }
