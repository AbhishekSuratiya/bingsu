import React, { useEffect, useRef, useState } from 'react';
import AWS from 'aws-sdk';
import {
  cloudWatchDescribeLogStreams,
  cloudWatchPutLogEvents,
} from '../utils/cloudWatch';
import { useDispatch, useSelector } from 'react-redux';
import getLogStream from '../utils/getLogStream';
import { awsAction } from '../redux/reducers/awsReducer';

export const LoggerContext = React.createContext();

const Logger = ({ children }) => {
  const [streamName, setStreamName] = useState('');
  let nextSequenceToken = useRef(null).current;
  const eventsQueue = useRef([]).current;
  let interval = useRef(null).current;
  const dispatch = useDispatch();
  const {
    isLoggingEnabled,
    isAwsConnected,
    qrData: { LOG_GROUP_NAME: logGroupName },
  } = useSelector(state => state.awsStore);
  useEffect(() => {
    if (!isAwsConnected || !logGroupName) {
      return;
    }
    const logStreamName = getLogStream();
    const cloudWatchLogs = new AWS.CloudWatchLogs();
    const params = { logGroupName, logStreamName };
    cloudWatchLogs.createLogStream(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        setStreamName(logStreamName);
        dispatch(awsAction.setLogStreamName(logStreamName));
        console.log(data);
      }
    });
  }, [isAwsConnected]);

  async function startLogQueueToCloudWatch() {
    if (!streamName) {
      return;
    }
    if (interval == null) {
      interval = setInterval(async () => {
        if (eventsQueue.length === 0) {
          clearInterval(interval);
          interval = null;
          return;
        }
        const event = eventsQueue.shift();
        try {
          const res = await cloudWatchPutLogEvents(
            [event],
            logGroupName,
            streamName,
            nextSequenceToken,
          );
          nextSequenceToken = res.nextSequenceToken;
        } catch (error) {
          console.log(error);
        }
      }, 2000);
    }
  }

  async function log(message) {
    if (!isLoggingEnabled || !logGroupName) {
      return;
    }
    if (nextSequenceToken === null) {
      const res = await cloudWatchDescribeLogStreams(logGroupName);
      nextSequenceToken = res.logStreams[0].uploadSequenceToken;
    }
    eventsQueue.push({
      message,
      timestamp: new Date().getTime(),
    });
    await startLogQueueToCloudWatch();
  }

  return (
    <LoggerContext.Provider value={log}>{children}</LoggerContext.Provider>
  );
};

export default Logger;
