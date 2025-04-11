import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Header;
