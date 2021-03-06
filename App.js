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
    if (!newClient.connected) newClient.createSession();
    console.log(newClient);
    setClient(newClient);
  }

  const disconnect = () => {
    if (client?.connected) client.killSession();
    console.log("DISCONNECTED", text, client);
  }

  function subscribeToEvents() {
    console.log('ACTION', 'subscribeToEvents');
  
    if (client) {
      client?.on(
        'session_request',
        function (error, payload) {
          console.log('EVENT', 'session_request', payload);
  
          if (error) {
            throw error;
          }
          client.approveSession({
            accounts: ['0xa6e79778bd668ca8e001c7cb3c54423470c9561f5910f2cd055d641ba2fa968b'],
            chainId: 1
          })
          console.log("approved", text, client);
          setClient(client);
        }
      );
  
      client?.on(
        'session_update',
        function (error, payload) {
          console.log('EVENT', 'session_update', payload);
          if (error) {
            throw error;
          }
          setClient(client);
        }
      );
  
      client?.on('call_request', function (error, payload) {
        console.log('EVENT', 'call_request', 'method', payload.method);
        console.log('EVENT', 'call_request', 'params', payload.params);
        if (error) {
          throw error;
        }
      });
  
      client?.on('connect', function (error, payload) {
        console.log('EVENT', 'connect', payload);
        if (error) {
          throw error;
        }
      });
  
      client?.on('disconnect', function (error, payload) {
        console.log('EVENT', 'disconnect', payload);
        if (error) {
          throw error;
        }
      });
    }
  }

  React.useEffect(() => {
    if (client)  {
      console.log('MY CLIENT:', client, client.connected);
      // client.rejectSession();
      subscribeToEvents();
    }
  }, [client])

  React.useEffect(() => {
    console.log('MY CLIENT STATUS:', client?.connected);
  }, [client?.connected])

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
        <Text style={{
          textAlign: 'center',
        }}>{client && client.connected ? 'You are connected' : 'You are disconnected'}</Text>
        <Button
          title="Connect"
          onPress={() => connect()}
        />
        <Button
          title="Disconnect"
          onPress={() => disconnect()}
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
