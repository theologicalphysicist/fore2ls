#_ BASE IMAGE
FROM public.ecr.aws/lambda/python:3.10

#_ COPY REQUIRED FILES
COPY requirements.txt ${LAMBDA_TASK_ROOT}
COPY main.py ${LAMBDA_TASK_ROOT}

#_ SCRIPTS TO RUN
RUN pip install -r requirements.txt
#_ HANDLING TAR INSTALLATION
RUN yum -y update && yum -y install wget vi openssl.x86_64 glibc.x86_64 tar tar.x86_64 inetutils-ping net-tools telnet which file

#_ HANDLER COMMAND
CMD [ "main.handler" ]
