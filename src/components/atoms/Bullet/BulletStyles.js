import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';

export default StyleSheet.create({
  bulletCircle: {
    borderRadius: 10,
    backgroundColor: Colors.dark4,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  root: {
    flexDirection: 'row',
  },
  circleWrapper: {
    justifyContent: 'center',
  },
  bulletNumber: {
    fontSize: 12,
    color: Colors.grey80,
  },
});
