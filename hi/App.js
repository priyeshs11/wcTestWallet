import logo from './logo.svg';
import './App.css';
import * as React from "react";
import WalletConnect from "@walletconnect/client";

function App() {

  const [text, onChangeText] = React.useState("");
  const [client, setClient] = React.useState(null);

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
    console.log("connected", text, newClient);
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
        }
      );
  
      client?.on(
        'session_update',
        function (error, payload) {
          console.log('EVENT', 'session_update', payload);
          if (error) {
            throw error;
          }
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
      console.log(client);
      // client.rejectSession();
      subscribeToEvents();
    }
  }, [client])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input placeholder="WC URI" onChange={(e) => onChangeText(e.target.value)}></input>
        <br/>
        <button onClick={() => connect()}>Connect</button>
        <br/>
        <button onClick={() => disconnect()}>Disonnect</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
