import React, { useEffect, useState } from 'react';
import Aws from 'aws-sdk/dist/aws-sdk-react-native';
import AwsIot from 'aws-iot-device-sdk';
import { AWS_IOT_ENDPOINT, AWS_TOPIC_NAME } from '../utils/contants';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../redux/reducers/awsReducer';

export const AwsContext = React.createContext();

const InitialiseAws = ({ children }) => {
  const { awsRegion, cognitoIdentityPool } = useSelector(
    state => state.awsStore,
  );
  const [awsClient, setAwsClient] = useState(null);
  const dispatch = useDispatch();
  const initialise = () => {
    Aws.config.region = awsRegion;
    Aws.config.credentials = new Aws.CognitoIdentityCredentials({
      IdentityPoolId: cognitoIdentityPool,
    });
    Aws.config.credentials.get(() => {
      const config = {};
      let client = null;

      config.host = AWS_IOT_ENDPOINT;
      config.protocol = 'wss';
      config.clientId = `client-${Math.floor(Math.random() * 100000 + 1)}`;
      config.accessKeyId = Aws.config.credentials.accessKeyId;
      config.secretKey = Aws.config.credentials.secretAccessKey;
      config.sessionToken = Aws.config.credentials.sessionToken;

      client = AwsIot.device(config);
      client.on('connect', () => {
        console.log('Connected established ➡');
        client.subscribe(AWS_TOPIC_NAME);
        client.publish(
          AWS_TOPIC_NAME,
          JSON.stringify({ message: 'Connected established ➡' }),
        );
        setAwsClient(client);
        dispatch(awsAction.setIsAwsConnected(true));
      });

      client.on('close', () => {
        console.log('Disconnected ➡');
        client.subscribe(AWS_TOPIC_NAME);
        client.publish(
          AWS_TOPIC_NAME,
          JSON.stringify({ message: 'Disconnected ➡' }),
        );
        setAwsClient(null);
        dispatch(awsAction.setIsAwsConnected(false));
      });

      client.on('message', (topic, message) => {
        console.log(topic, message.toString());
      });

      client.on('error', error => {
        console.log(error);
      });
      client.publish(
        AWS_TOPIC_NAME,
        JSON.stringify({ message: 'Connected established ➡' }),
      );
    });
  };
  useEffect(() => {
    awsRegion && cognitoIdentityPool && initialise();
  }, [awsRegion, cognitoIdentityPool]);
  return (
    <AwsContext.Provider value={awsClient}>{children}</AwsContext.Provider>
  );
};

export default InitialiseAws;
