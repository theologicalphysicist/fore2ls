#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {aws_lambda as lambda, aws_s3 as s3, aws_iam as iam, Duration} from 'aws-cdk-lib';
import { Construct } from 'constructs';

//_ LOCAL
import { LambdaProperties } from './types';


const ENVIRONMENT: any = {}; //* .env variables stored here


class TsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here

        // example resource
        // const queue = new sqs.Queue(this, 'TsQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
    }


    Lambda(lambda_props: LambdaProperties): lambda.Function {
        const LAMBDA_FUNCTION = new lambda.Function(
            this,
            lambda_props.ID,
            {
                runtime: lambda.Runtime.NODEJS_LATEST,
                handler: "index.ts",
                code: lambda.Code.fromAsset("code.zip"),
                functionName: lambda_props.name,
                architecture: lambda.Architecture.X86_64,
                role: process.env.ROLE_ARN != undefined ? iam.Role.fromRoleArn(this, lambda_props.roleID, process.env.ROLE_ARN) : undefined,
                environment: ENVIRONMENT,
                memorySize: lambda_props.memorySize,
                timeout: Duration.seconds(lambda_props.timeoutDuration)
            }
        );
        const LAMBDA_FUNCTION_URL = LAMBDA_FUNCTION.addFunctionUrl({
            authType: cdk.aws_lambda.FunctionUrlAuthType.NONE
        });

        new cdk.CfnOutput(this, "lambda-url", {value: LAMBDA_FUNCTION_URL.url});

        return LAMBDA_FUNCTION;
    }


    ContainerLambda() {}


    S3Bucket() {}
}


const APP = new cdk.App();
new TsStack(
    APP,
    'TsStack', 
    {
        /* If you don't specify 'env', this stack will be environment-agnostic.
        * Account/Region-dependent features and context lookups will not work,
        * but a single synthesized template can be deployed anywhere. */

        /* Uncomment the next line to specialize this stack for the AWS Account
        * and Region that are implied by the current CLI configuration. */
        // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

        /* Uncomment the next line if you know exactly what Account and Region you
        * want to deploy the stack to. */
        env: { 
            account: process.env.AWS_ACCOUNT_ID, 
            region: process.env.AWS_REGION 
        },

        /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
    }
);
// APP.synth();