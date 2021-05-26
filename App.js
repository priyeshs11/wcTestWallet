/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  Text,
  View,
  Button,
} from 'react-native';
import WalletConnect from '@walletconnect/client';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


const App = () => {

  const [text, onChangeText] = React.useState("");
  const [client, setClient] = React.useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const SYLO_WC_CLIENT_META = {
    description: 'Sylo Smart Wallet',
    url: 'https://sylo.io/',
    icons: ['https://sylo.io/favicon-32x32.png'],
    name: 'Sylo',
  };

  const connect = () => {
    const newClient = new WalletConnect({
      uri: text,
      clientMeta: SYLO_WC_CLIENT_META,
    });
    setClient(newClient);
    subscribeToEvents(newClient);
  }

  function subscribeToEvents(connector) {
    console.log('ACTION', 'subscribeToEvents');
  
    if (connector) {
      connector.on(
        'session_request',
        function (error, payload) {
          console.log('EVENT', 'session_request', payload);
  
          if (error) {
            throw error;
          }
        }
      );
  
      connector.on(
        'session_update',
        function (error, payload) {
          console.log('EVENT', 'session_update', payload);
          if (error) {
            throw error;
          }
        }
      );
  
      connector.on('call_request', function (error, payload) {
        console.log('EVENT', 'call_request', 'method', payload.method);
        console.log('EVENT', 'call_request', 'params', payload.params);
        if (error) {
          throw error;
        }
      });
  
      connector.on('connect', function (error, payload) {
        console.log('EVENT', 'connect', payload);
        if (error) {
          throw error;
        }
      });
  
      connector.on('disconnect', function (error, payload) {
        console.log('EVENT', 'disconnect', payload);
        if (error) {
          throw error;
        }
      });
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder={'WC URI'}
        />
        <Text>Hello</Text>
        <Button
          title="Press me"
          onPress={() => connect()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
