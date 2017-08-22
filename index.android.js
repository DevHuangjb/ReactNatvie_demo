/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
} from 'react-native';

import App from './Components/app'

export default class BabyShow extends Component {
  render() {
    return (
        <App/>
    );
  }
}

AppRegistry.registerComponent('BabyShow', () => BabyShow);
