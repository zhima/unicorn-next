import '../styles/globals.css'
import { SnackbarProvider } from 'notistack';
import { store } from '/utils/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  
  return (
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <Component {...pageProps} />
        </SnackbarProvider>
    </Provider>
  );
}

export default MyApp
