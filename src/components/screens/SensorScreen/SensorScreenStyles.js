import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';

const styles = StyleSheet.create({
  sensorCard: {
    padding: 16,
    paddingBottom: 0,
  },
  saveYourData: {
    color: Colors.grey80,
    fontSize: 13,
    marginBottom: 16,
  },
  connectToAws: {
    color: Colors.white100,
    marginBottom: 4,
    fontSize: 16,
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
});

export default styles;
