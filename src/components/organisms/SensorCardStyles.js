import { StyleSheet } from 'react-native';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';

const styles = StyleSheet.create({
  lineChart: { flex: 1 },
  lineChartContainer: { flex: 1, marginLeft: 10 },
  yAxisContainer: { flexDirection: 'row', flex: 1 },
  coordinates: { color: Colors.white80, marginRight: 4 },
  coordinatesText: { flexDirection: 'row', marginRight: 16 },
  coordinatesContainer: { flexDirection: 'row', marginTop: 8 },
  sensorTitle: {
    color: Colors.white100,
    fontSize: 16,
    fontFamily: Fonts.icomoon,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  card: {
    padding: 16,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
  },
  root: { height: 300, width: '100%' },
});

export default styles;
