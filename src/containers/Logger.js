import React, { useRef } from 'react';
import {
  cloudWatchDescribeLogStreams,
  cloudWatchPutLogEvents,
} from '../utils/cloudWatch';
import { useSelector } from 'react-redux';

export const LoggerContext = React.createContext();

const Logger = ({ children }) => {
  let nextSequenceToken = useRef(null).current;
  const eventsQueue = useRef([]).current;
  let interval = useRef(null).current;
  const { isLoggingEnabled } = useSelector(state => state.awsStore);

  async function startLogQueueToCloudWatch() {
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
            '/AWSIotBingsu/bingsu-v2-1/app-logs',
            'testLogStream',
            nextSequenceToken,
          );
          nextSequenceToken = res.nextSequenceToken;
        } catch (error) {
          console.log(error);
        }
      }, 1000);
    }
  }

  async function log(message) {
    if (!isLoggingEnabled) {
      return;
    }
    if (nextSequenceToken == null) {
      const res = await cloudWatchDescribeLogStreams(
        '/AWSIotBingsu/bingsu-v2-1/app-logs',
      );
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
