const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const uuid = require('node-uuid');


exports.handler = function(event, context, callback) {

    // Retrieve the bucket & key for the uploaded S3 object that
    // caused this Lambda function to be triggered
    var src_bkt = event.Records[0].s3.bucket.name;
    var src_key = event.Records[0].s3.object.key;

    // Retrieve the object
    s3.getObject({
        Bucket: src_bkt,
        Key: src_key
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            var rawS3EventsData = data.Body.toString('ascii');
            console.log("Raw data:\n" + rawS3EventsData);
            var events = rawS3EventsData.split(/[\r\n]+/); 
            console.log(events);
            for(let event of events) {
                const jsonObj = JSON.parse(event);
                console.log(jsonObj);
                var eventType = jsonObj.event_type;
                console.log(eventType);
                
                // Create the DynamoDB service object
                var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
            
                var params = {
                    TableName: 'notification_event',
                    Item: {
                        'Id' : {S: uuid.v4()},
                        'Event' : {S: eventType}
                    }
                };

                // Call DynamoDB to add the item to the table
                ddb.putItem(params, function(err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        console.log("Success", data);
                    }
                });
            }
            
            callback(null, null);
        }
    });
};