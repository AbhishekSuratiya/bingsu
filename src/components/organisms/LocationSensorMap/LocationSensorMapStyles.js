import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';

const styles = StyleSheet.create({
  currentValue: { color: Colors.white80, marginTop: 8 },
  card: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
    height: 350,
    minHeight: SENSOR_CARD_HEADER,
  },
  title: {
    color: Colors.white100,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SENSOR_CARD_HEADER,
    alignItems: 'center',
  },
  root: {
    padding: 16,
    paddingBottom: 0,
    width: '100%',
    minHeight: SENSOR_CARD_HEADER,
  },
  map: { flex: 1, width: '100%', borderRadius: 8 },
});

export default styles;
