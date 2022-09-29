import { StyleSheet } from 'react-native';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import { SENSOR_CARD_HEADER } from '../../utils/contants';

const styles = StyleSheet.create({
  lineChart: { flex: 1 },
  lineChartContainer: { flex: 1, marginLeft: 10 },
  yAxisContainer: { flexDirection: 'row', flex: 1 },
  currentValue: { color: Colors.white80, marginTop: 8 },
  card: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
    height: 300,
  },
  title: {
    color: Colors.white100,
    fontSize: 16,
    fontFamily: Fonts.icomoon,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SENSOR_CARD_HEADER,
    alignItems: 'center',
  },
  content: {
    backgroundColor: Colors.dark5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  root: {
    padding: 16,
    paddingBottom: 0,
    width: '100%',
  },
});

export default styles;
