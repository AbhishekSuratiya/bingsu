import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  root: {
    paddingBottom: 16,
  },
  sensorCard: {
    padding: 16,
    paddingBottom: 0,
  },
  saveYourData: {
    color: Colors.grey80,
    fontSize: 13,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  connectToAws: {
    color: Colors.white100,
    marginBottom: 4,
    fontSize: 16,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  connectToAwsWrapper: {
    padding: 16,
    backgroundColor: Colors.dark5,
    borderRadius: 8,
  },
  connectToAwsSpacing: {
    padding: 16,
    paddingBottom: 0,
  },
  connectToAwsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bulbIcon: { marginRight: 8 },
});

export default styles;
