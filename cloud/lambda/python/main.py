import json, os, boto3

from src.utils.logger import Verbal


LAMBDA_LOGGER = Verbal(framework="lambda", name="lambda") #TODO: update logger to be compatible with cloud9 IDE in AWS


def handler(event, context):


    LAMBDA_LOGGER.debug(event)


    return {
        "statusCode": 200,
        "body": {
            "no": "aether"
        }
    }