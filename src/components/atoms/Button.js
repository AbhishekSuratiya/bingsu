import React from 'react';
import Colors from '../../theme/Colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ title, light, negative, ...rest }) => {
  return (
    <TouchableOpacity
      style={[styles.root, light && { backgroundColor: Colors.white100 }]}
      {...rest}>
      <Text
        style={[
          styles.text,
          light && { color: Colors.black },
          negative && { color: Colors.red },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.dark4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  text: {
    color: Colors.blue,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
