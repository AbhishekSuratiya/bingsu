import React, { useState } from 'react';
import Colors from '../../theme/Colors';
import { Switch, Text, View } from 'react-native';
import Fonts from '../../theme/Fonts';
import { Grid, LineChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const SensorCard = ({ sensorData, title, startSensor, stopSensor }) => {
  const [isSensorListening, setIsSensorListening] = useState(true);
  const xCoordinate = sensorData?.map(data => data.x);
  const yCoordinate = sensorData?.map(data => data.y);
  const zCoordinate = sensorData?.map(data => data.z);

  const data = [
    {
      data: xCoordinate,
      svg: { stroke: Colors.red },
    },
    {
      data: yCoordinate,
      svg: { stroke: Colors.green },
    },
    {
      data: zCoordinate,
      svg: { stroke: Colors.blue },
    },
  ];

  const axesSvg = { fontSize: 10, fill: Colors.white80 };
  const verticalContentInset = { top: 10, bottom: 10 };
  return (
    <View style={{ height: 300, padding: 16, width: '100%', paddingBottom: 0 }}>
      <View
        style={{
          padding: 16,
          flex: 1,
          backgroundColor: Colors.dark5,
          borderRadius: 12,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 16,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: Colors.white100,
                fontSize: 16,
                fontFamily: Fonts.icomoon,
              }}>
              {title}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <View style={{ flexDirection: 'row', marginRight: 16 }}>
                <Text style={{ color: Colors.white80, marginRight: 4 }}>
                  x:
                </Text>
                <Text style={{ color: Colors.red }}>
                  {xCoordinate[xCoordinate.length - 1]?.toFixed(3)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginRight: 16 }}>
                <Text style={{ color: Colors.white80, marginRight: 4 }}>
                  y:
                </Text>
                <Text style={{ color: Colors.green }}>
                  {' '}
                  {xCoordinate[xCoordinate.length - 1]?.toFixed(3)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginRight: 16 }}>
                <Text style={{ color: Colors.white80, marginRight: 4 }}>
                  z:
                </Text>
                <Text style={{ color: Colors.blue }}>
                  {' '}
                  {xCoordinate[xCoordinate.length - 1]?.toFixed(3)}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Switch
              trackColor={{ false: '#787880', true: Colors.blue }}
              thumbColor={'white'}
              onValueChange={() => {
                if (isSensorListening) {
                  stopSensor();
                } else {
                  startSensor();
                }
                setIsSensorListening(val => !val);
              }}
              value={isSensorListening}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {xCoordinate.length > 2 && (
            <YAxis
              data={xCoordinate}
              contentInset={verticalContentInset}
              svg={axesSvg}
            />
          )}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={data}
              svg={{
                strokeWidth: 2.5,
              }}
              curve={shape.curveNatural}
              contentInset={verticalContentInset}>
              <Grid
                svg={{
                  stroke: Colors.grey,
                }}
              />
            </LineChart>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SensorCard;
