import React, { useEffect, useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { awsAction } from '../redux/reducers/awsReducer';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { getData, removeData } from '../utils/asyncStorage';
import validateQrCode from '../utils/validateQrCode';

export const AwsContext = React.createContext();

const InitialiseAws = ({ children }) => {
  const {
    awsRegion,
    cognitoIdentityPool,
    roleArn,
    secretAccessKey,
    sessionToken,
    accessKeyId,
    qrData,
  } = useSelector(state => state.awsStore);
  const [awsClient, setAwsClient] = useState(null);
  const stackDetectionRef = useRef(null);

  const dispatch = useDispatch();

  const getStoredCred = async () => {
    const qrCode = await getData('qrCode');
    if (qrCode !== null) {
      dispatch(awsAction.setIsConnecting(true));
      const qrCodeObject = JSON.parse(qrCode);
      const isValidQr = validateQrCode(qrCodeObject);
      if (!isValidQr) {
        console.error('Invalid QR');
        return;
      }
      dispatch(awsAction.setAwsRegion(qrCodeObject.REGION));
      dispatch(awsAction.setCognitoIdentityPool(qrCodeObject.COGNITO_POOL_ID));
      dispatch(awsAction.setRoleArn(qrCodeObject.COGNITO_UNAUTH_ROLE_ARN));
      dispatch(awsAction.setQrData(qrCodeObject));
    }
  };

  useEffect(() => {
    getStoredCred();
  }, []);

  const checkStackDeletion = () => {
    const cloudformation = new AWS.CloudFormation();
    cloudformation.describeStacks({ StackName: qrData?.PROJECT_NAME }, err => {
      if (err) {
        dispatch(awsAction.setIsAwsConnected(false));
        dispatch(awsAction.setQrData({}));
        dispatch(awsAction.setAwsRegion(''));
        dispatch(awsAction.setCognitoIdentityPool(''));
        dispatch(awsAction.setRoleArn(''));
        dispatch(awsAction.setIsAwsConnected(false));
        dispatch(awsAction.setAccessKeyId(null));
        dispatch(awsAction.setSessionToken(null));
        dispatch(awsAction.setSecretAccessKey(null));
        removeData('qrCode');
      }
    });
  };

  const getClient = async () => {
    const client = new IoTSiteWiseClient({
      region: awsRegion,
      credentials: { accessKeyId, secretAccessKey, sessionToken },
    });
    setAwsClient(client);
    dispatch(awsAction.setIsConnecting(false));
    // Delay to show check animation properly
    dispatch(awsAction.setShowValidatedAnimation(true));
    setTimeout(() => {
      dispatch(awsAction.setShowValidatedAnimation(false));
      dispatch(awsAction.setIsAwsConnected(true));
    }, 1000);
    stackDetectionRef.current = setInterval(checkStackDeletion, 5000);
  };

  const initialise = async () => {
    AWS.config.region = awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: cognitoIdentityPool,
      RoleArn: roleArn,
    });
    AWS.config.credentials.get(() => {
      dispatch(awsAction.setAccessKeyId(AWS.config.credentials.accessKeyId));
      dispatch(awsAction.setSessionToken(AWS.config.credentials.sessionToken));
      dispatch(
        awsAction.setSecretAccessKey(AWS.config.credentials.secretAccessKey),
      );
    });
  };

  useEffect(() => {
    awsRegion && cognitoIdentityPool && roleArn && initialise();
  }, [awsRegion, cognitoIdentityPool, roleArn]);

  useEffect(() => {
    if (accessKeyId && secretAccessKey && sessionToken) {
      getClient();
    }
  }, [accessKeyId, secretAccessKey, sessionToken]);

  useEffect(() => {
    return () => clearInterval(stackDetectionRef.current);
  }, []);

  return (
    <AwsContext.Provider value={awsClient}>{children}</AwsContext.Provider>
  );
};

export default InitialiseAws;
