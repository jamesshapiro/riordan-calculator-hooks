import utils


def lambda_handler(event, context):
    return utils.get_success_response('{"status": "not_implemented"}')
