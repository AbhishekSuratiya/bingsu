import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
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
  content: {
    flex: 1,
    backgroundColor: Colors.dark5,
    overflow: 'hidden',
  },
  root: {
    padding: 16,
    paddingBottom: 0,
    width: '100%',
  },
  batteryLevelWrapper: {
    height: 24,
    width: '100%',
    backgroundColor: Colors.dark4,
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  dataText: {
    color: Colors.white100,
    fontSize: 14,
    marginBottom: 4,
  },
  batteryLevel: {
    height: '100%',
    backgroundColor: Colors.orange2,
  },
});

export default styles;
