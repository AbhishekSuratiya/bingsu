import React from 'react';
import { Text, View } from 'react-native';
import styles from './BulletStyles';
const Bullet = ({ children, number, style }) => {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.circleWrapper}>
        <View style={styles.bulletCircle}>
          <Text style={styles.bulletNumber}>{number}</Text>
        </View>
      </View>
      {children}
    </View>
  );
};

export default Bullet;
