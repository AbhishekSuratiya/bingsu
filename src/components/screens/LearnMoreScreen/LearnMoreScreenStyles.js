import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';
import Fonts from '../../../theme/Fonts';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  awsIot: {
    color: Colors.blue,
    fontSize: 24,
    marginBottom: 24,
    fontFamily: Fonts.AmazonEmberRegular,
  },
  tnc: {
    color: Colors.blue,
    fontSize: 24,
    fontFamily: Fonts.AmazonEmberRegular,
  },
});

export default styles;
