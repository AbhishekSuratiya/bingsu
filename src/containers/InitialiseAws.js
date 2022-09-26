import React, { useEffect, useState } from 'react';
import Aws from 'aws-sdk/dist/aws-sdk-react-native';
import AwsIot from 'aws-iot-device-sdk';
import { AWS_TOPIC_NAME } from '../utils/contants';

const AWS_REGION = 'us-west-2';
const AWS_COGNITO_IDENTITY_POOL =
  'us-west-2:72a1e01b-80c5-4dad-ba5a-a130f3eb51da';
const AWS_IOT_ENDPOINT = 'a28q0qgycwbp4k-ats.iot.us-west-2.amazonaws.com';
export const AwsContext = React.createContext();

const InitialiseAws = ({ children }) => {
  const [awsClient, setAwsClient] = useState(null);
  Aws.config.region = AWS_REGION;
  Aws.config.credentials = new Aws.CognitoIdentityCredentials({
    IdentityPoolId: AWS_COGNITO_IDENTITY_POOL,
  });

  useEffect(() => {
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
      });

      client.on('message', (topic, message) => {
        console.log(topic, message.toString());
      });

      client.on('error', error => {
        console.log(error);
      });
    });
  }, []);
  return (
    <AwsContext.Provider value={awsClient}>{children}</AwsContext.Provider>
  );
};

export default InitialiseAws;
