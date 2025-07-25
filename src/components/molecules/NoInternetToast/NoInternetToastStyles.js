import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.red3,
    height: 64,
    width: '100%',
    position: 'absolute',
    bottom: 80,
    zIndex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  somethingWrongTxt: {
    color: Colors.white100,
    fontSize: 13,
    paddingRight: 24,
    flex: 1,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  retryBtn: {
    backgroundColor: Colors.white100,
    height: 32,
    fontWeight: 'bold',
    justifyContent: 'center',
    borderRadius: 6,
  },
  retryTxt: {
    color: Colors.black,
    fontSize: 13,
    paddingHorizontal: 24,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  rootIos: {
    bottom: 116,
  },
});

export default styles;
