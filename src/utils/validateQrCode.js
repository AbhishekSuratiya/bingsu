const keys = [
  'ASSET_MODEL_MEASUREMENTS_PREFIX',
  'COGNITO_POOL_ID',
  'COGNITO_UNAUTH_ROLE_ARN',
  'KINESIS_VIDEO_CHANNEL_NAME',
  'LOGGING_TOGGLE_URL',
  'LOG_GROUP_NAME',
  'PROJECT_NAME',
  'REGION',
];

const validateQrCode = qrCode => {
  let qrIsValid = true;
  const qrKeys = Object.keys(qrCode);
  qrKeys.forEach(k => {
    if (!keys.includes(k)) {
      qrIsValid = false;
    }
  });
  if (qrKeys.length !== keys.length) {
    qrIsValid = false;
  }
  return qrIsValid;
};

export default validateQrCode;
