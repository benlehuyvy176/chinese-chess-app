/**
 * Chinese Chess (Xiangqi) Mobile App
 * React Native application for both Android and iOS
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GameScreen } from './src/screens';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#DEB887"
        translucent={false}
      />
      <View style={styles.container}>
        <GameScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEB887', // Burlywood background
  },
});

export default App;
