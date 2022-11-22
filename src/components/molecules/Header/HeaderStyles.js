import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';

export default StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.white100,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    fontFamily: Fonts.AmazonEmberBold,
  },
  connectionStatus: {
    fontSize: 13,
    color: Colors.grey,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  animationContainer: {
    width: 6,
    height: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedDot: {
    backgroundColor: Colors.orange,
    borderRadius: 10,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.green,
    marginRight: 8,
    borderRadius: 10,
  },
  dotDisConnected: {
    backgroundColor: Colors.red,
  },
  connectionStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
