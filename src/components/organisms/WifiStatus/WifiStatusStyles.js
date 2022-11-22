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
    height: 100,
    minHeight: SENSOR_CARD_HEADER,
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
  dataText: {
    color: Colors.white100,
    fontSize: 14,
    marginBottom: 4,
    fontFamily: Fonts.AmazonEmberRegular,
  },
});

export default styles;
