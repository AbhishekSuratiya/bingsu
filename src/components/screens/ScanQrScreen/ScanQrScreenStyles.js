import { StyleSheet } from 'react-native';
import Colors from '../../../theme/Colors';

const styles = StyleSheet.create({
  barcodeHeading: {
    fontSize: 16,
    color: Colors.white100,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 16,
  },
  steps: {
    fontSize: 13,
    color: Colors.grey80,
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
  stepsWrapper: { paddingHorizontal: 16 },
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
});

export default styles;
