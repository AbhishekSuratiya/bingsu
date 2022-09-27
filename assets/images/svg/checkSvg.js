import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckSvg = props => (
  <Svg width={88} height={88} xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      d="M39.48 55.98a1.4 1.4 0 0 1-1.96 0l-11-11a1.4 1.4 0 0 1 0-1.96 1.4 1.4 0 0 1 1.96 0L38.5 53.058 59.52 32.02a1.4 1.4 0 0 1 1.96 0 1.4 1.4 0 0 1 0 1.96l-22 22ZM88 44c0 24.303-19.697 44-44 44S0 68.303 0 44 19.697 0 44 0s44 19.697 44 44ZM44 2.75C21.227 2.75 2.75 21.227 2.75 44S21.227 85.25 44 85.25 85.25 66.773 85.25 44 66.773 2.75 44 2.75Z"
      fill="#00D166"
      fillRule="nonzero"
    />
  </Svg>
);

export default CheckSvg;
