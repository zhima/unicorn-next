import '../styles/globals.css'
import React, {useEffect, memo} from 'react';
import { SnackbarProvider } from 'notistack';
import { store, persistor } from '/utils/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('App useEffect');
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider maxSnack={3}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp
