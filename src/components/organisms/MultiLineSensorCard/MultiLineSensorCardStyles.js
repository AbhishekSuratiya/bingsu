import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import {
  SENSOR_CARD_HEADER,
  SENSOR_CARD_HEIGHT,
} from '../../../utils/contants';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  lineChart: { flex: 1 },
  lineChartContainer: { flex: 1, marginLeft: 10 },
  yAxisContainer: { flexDirection: 'row', flex: 1 },
  coordinates: {
    color: Colors.white80,
    marginRight: 4,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  coordinatesText: { flexDirection: 'row', marginRight: 16 },
  coordinatesContainer: { flexDirection: 'row', marginTop: 8 },
  sensorTitle: {
    color: Colors.white100,
    fontSize: 16,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    height: SENSOR_CARD_HEADER,
    alignItems: 'center',
  },
  card: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
    height: SENSOR_CARD_HEIGHT,
  },
  root: {
    width: '100%',
  },
  title: {
    justifyContent: 'center',
    flex: 1,
  },
  yAxis: { minWidth: 56 },
});

export default styles;
