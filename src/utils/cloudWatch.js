import AWS from 'aws-sdk';

function cloudWatchPutLogEvents(events, group, stream, sequenceToken) {
  return new Promise((resolve, reject) => {
    const cloudWatchLogs = new AWS.CloudWatchLogs();
    const params = {
      logEvents: events,
      logGroupName: group,
      logStreamName: stream,
      sequenceToken,
    };
    cloudWatchLogs.putLogEvents(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function cloudWatchDescribeLogStreams(group) {
  return new Promise((resolve, reject) => {
    const cloudWatchLogs = new AWS.CloudWatchLogs();
    const params = {
      logGroupName: group,
    };
    cloudWatchLogs.describeLogStreams(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export { cloudWatchPutLogEvents, cloudWatchDescribeLogStreams };
