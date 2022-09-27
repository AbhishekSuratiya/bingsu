import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const InfoSvg = props => (
  <Svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M12 2c5.522 0 10 4.477 10 10s-4.478 10-10 10C6.477 22 2 17.523 2 12S6.477 2 12 2Zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8Zm0 6a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1Zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      fill={props.fill}
      fillRule="evenodd"
    />
  </Svg>
);

export default InfoSvg;
