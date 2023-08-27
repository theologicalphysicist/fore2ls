#!/usr/bin/env python3
import os, dotenv

from aws_cdk import (
    Stack, Duration, CfnOutput, Environment, App, aws_lambda,
    aws_iam as iam,
    aws_s3 as s3,
    aws_s3_deployment as s3deploy
)
from constructs import Construct


ENVIRONMENT: dict = dotenv.dotenv_values("./.env.production", verbose=True)


app = App()
class CDKDeploymentStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)


    def Lambda(self, 
        lambda_id: str = "lambda-function", 
        lambda_name: str = "lambda-function",
        memory_size: int = 128,
        timeout_duration: int = 3,
        role_id: str = "lambda-role"
    ) -> aws_lambda.IFunction: #TODO: consider using **kwargs
        
        #_ DEFINE LAMBDA FUNCTION
        LAMBDA_FUNCTION: aws_lambda.IFunction = aws_lambda.Function(
            scope=self,
            id=lambda_id,
            function_name=lambda_name,
            code=aws_lambda.Code.from_asset("code.zip"),
            architecture=aws_lambda.Architecture.X86_64,
            handler="main.handler",
            runtime=aws_lambda.Runtime.PYTHON_3_11,
            role=iam.Role.from_role_arn(scope=self,id=role_id,role_arn=ENVIRONMENT["ROLE_ARN"]) if "ROLE_ARN" in ENVIRONMENT else None,
            environment=ENVIRONMENT,
            memory_size=memory_size,
            timeout=Duration.seconds(timeout_duration)
        )
        LAMBDA_URL = LAMBDA_FUNCTION.add_function_url(
            auth_type=aws_lambda.FunctionUrlAuthType.NONE
        )
        CfnOutput(self, "aleph-lambda-url", value=LAMBDA_URL.url) #* print out function url

        return LAMBDA_FUNCTION


    def ContainerLambda(self,
        lambda_id: str = "container-lambda-function", 
        lambda_name: str = "container-lambda-function",
        memory_size: int = 128,
        timeout_duration: int = 3,
        role_id: str = "container-lambda-role"
    ) -> aws_lambda.IFunction:
        
        AWS_ROLE = iam.Role.from_role_arn(
            scope=self,
            id=role_id,
            role_arn=ENVIRONMENT["ROLE_ARN"]
        ) if "ROLE_ARN" in ENVIRONMENT else None

        ECR_IMAGE = aws_lambda.EcrImageCode.from_asset_image(
            directory="code"
        )

        CONTAINER_LAMBDA = aws_lambda.Function(
            scope=self,
            id=lambda_id,
            function_name=lambda_name,
            role=iam.Role.from_role_arn(scope=self,id=role_id,role_arn=ENVIRONMENT["ROLE_ARN"]) if "ROLE_ARN" in ENVIRONMENT else None,
            code=ECR_IMAGE,
            handler=aws_lambda.Handler.FROM_IMAGE,
            runtime=aws_lambda.Runtime.FROM_IMAGE,
            environment=ENVIRONMENT,
            memory_size=memory_size,
            timeout=Duration.seconds(timeout_duration)
        )
        CONATINER_LAMBDA_URL = CONTAINER_LAMBDA.add_function_url(
            auth_type=aws_lambda.FunctionUrlAuthType.NONE
        )
        CfnOutput(self, "aleph-lambda-url", value=CONATINER_LAMBDA_URL.url) #* print out function url


    def S3Bucket(self,sources: list[str],bucket_id: str = "bucket",object_id: str = "objects",mem_limit: int = 512) -> s3.IBucket:
        
        BUCKET = s3.Bucket(scope=self, id=bucket_id)

        if len(sources) > 0: s3deploy.BucketDeployment( #* i.e., bucket shouldn't be empty at deployment
            scope=self,
            id=object_id,
            sources=[s3deploy.Source.asset(source) for source in sources],
            destination_bucket=BUCKET,
            memory_limit=mem_limit
        )
        
        return BUCKET
        
        
CDKDeploymentStack(
    app, 
    "PythonStack",
    env=Environment(account=ENVIRONMENT["AWS_ACCOUNT_ID"], region=ENVIRONMENT["AWS_REGION"]),
)
app.synth()
