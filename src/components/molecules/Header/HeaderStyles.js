import { StyleSheet } from 'react-native';
import Fonts from '../../../theme/Fonts';
import Colors from '../../../theme/Colors';

export default StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark5,
  },
  back: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 17,
    color: 'white',
    fontFamily: Fonts.icomoon,
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 13,
    color: Colors.grey,
    fontFamily: Fonts.icomoon,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.green,
    marginRight: 6,
    borderRadius: 10,
  },
});
