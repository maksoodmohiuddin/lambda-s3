# readme
This is NodeJS code for a AWS Lambda Function that subcribes to a object create event in an AWS S3 bucket and insert into AWS DynamoDB table.

# lambda-s3
https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html

# create lamdbdaa
$ aws lambda create-function --profile magnolia --function-name SyncNotification \
--zip-file fileb://notification.zip --handler index.handler --runtime nodejs8.10 \
--timeout 10 --memory-size 1024 \
--role arn:aws:iam::xxxx:role/lambda-s3-role

# add permission 
aws lambda add-permission --function-name SyncNotification --principal s3.amazonaws.com \
--statement-id s3invoke --action "lambda:InvokeFunction" \
--source-arn arn:aws:s3:::sa-poc-pinpoint \
--source-account xxxx --profile magnolia

# test policy 
$ aws lambda get-policy --function-name SyncNotification --profile magnolia
