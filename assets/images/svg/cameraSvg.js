import * as React from 'react';
import Svg, { Defs, Path, G, Circle, Use } from 'react-native-svg';

const CameraSvg = props => (
  <Svg
    width={72}
    height={72}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <Defs>
      <Path
        d="M0 6.667A6.666 6.666 0 0 1 6.667 0a6.666 6.666 0 0 1 6.666 6.667 6.666 6.666 0 0 1-6.666 6.666A6.666 6.666 0 0 1 0 6.667Zm9.682-1.151a.73.73 0 0 0 0-1.032.73.73 0 0 0-1.031 0L5.833 7.302l-1.15-1.151a.73.73 0 0 0-1.032 0 .73.73 0 0 0 0 1.031L5.318 8.85a.73.73 0 0 0 1.031 0l3.333-3.333Z"
        id="a"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Circle fill="#48484A" cx={36} cy={36} r={36} />
      <Path
        d="M29 38c0-3.869 3.131-7 7-7s7 3.131 7 7-3.131 7-7 7-7-3.131-7-7Zm7-5c-2.763 0-5 2.237-5 5s2.237 5 5 5 5-2.237 5-5-2.237-5-5-5Zm6.681-8.949.65 1.949H48c2.206 0 4 1.794 4 4v16c0 2.206-1.794 4-4 4H24c-2.21 0-4-1.794-4-4V30c0-2.206 1.79-4 4-4h4.669l.65-1.949A2.993 2.993 0 0 1 32.163 22h7.675c1.293 0 2.437.826 2.843 2.051ZM24 28c-1.104 0-2 .894-2 2v16c0 1.106.896 2 2 2h24c1.106 0 2-.894 2-2V30c0-1.106-.894-2-2-2h-6.106l-1.106-3.316a1.002 1.002 0 0 0-.95-.684h-7.675c-.432 0-.813.276-.95.684L30.105 28H24Z"
        fill="#FFF"
        fillRule="nonzero"
      />
      <G transform="translate(43 19)">
        <Circle fill="#48484A" cx={8} cy={8} r={8} />
        <Use fill="#00D166" xlinkHref="#a" transform="translate(1.333 1.333)" />
      </G>
    </G>
  </Svg>
);

export default CameraSvg;
