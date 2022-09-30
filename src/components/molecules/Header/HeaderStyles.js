import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';

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
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 13,
    color: Colors.grey,
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
