import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import { SENSOR_CARD_HEADER } from '../../../utils/contants';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
    minHeight: SENSOR_CARD_HEADER,
  },
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 180,
  },
  title: {
    color: Colors.white100,
    fontSize: 16,
    fontFamily: Fonts.AmazonEmberRegular,
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
  webView: {
    width: '100%',
    justifyContent: 'center',
    height: 180,
  },
  spinner: {
    top: '40%',
  },
  switchCameraWrapper: {
    width: '100%',
    height: 36,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.dark4,
    flexDirection: 'row',
    padding: 3,
    top: -8,
  },
  switchCameraButton: {
    width: '50%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnText: {
    fontSize: 13,
    color: Colors.white100,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  allowText: {
    fontSize: 16,
    color: Colors.white100,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 24,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  allowTextDesc: {
    fontSize: 16,
    color: Colors.grey80,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  allowCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
});

export default styles;
