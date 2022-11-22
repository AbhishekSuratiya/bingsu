import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  barcodeHeading: {
    fontSize: 16,
    color: Colors.white100,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  steps: {
    fontSize: 13,
    color: Colors.grey80,
    flex: 1,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  bullets: {
    marginBottom: 12,
  },
  connected: {
    fontSize: 18,
    color: Colors.white100,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 38,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraRoot: {
    width: '100%',
    height: 350,
  },
  connectedWrapper: {
    padding: 16,
    flex: 1,
    paddingTop: 0,
  },
  stepsWrapper: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    borderWidth: 5,
    width: '65%',
    aspectRatio: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedIcon: { width: '50%' },
  allowText: {
    fontSize: 16,
    color: Colors.white100,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 24,
    fontFamily: Fonts.AmazonEmberBold,
  },
  allowTextDesc: {
    fontSize: 13,
    color: Colors.grey80,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  allowCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 32,
    backgroundColor: Colors.dark4,
  },
  loggerWrapper: {
    backgroundColor: Colors.dark4,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    height: 50,
  },
  loggerTxt: {
    color: Colors.white100,
    fontSize: 16,
  },
  activityIndicator: { marginRight: 16 },
});

export default styles;
