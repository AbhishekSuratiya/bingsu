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
  },
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 250,
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  root: {
    padding: 16,
    paddingBottom: 0,
    width: '100%',
  },
  webView: {
    flex: 0,
    width: '50%',
    height: 250,
    alignSelf: 'center',
  },
  spinner: {
    top: '40%',
  },
});

export default styles;
