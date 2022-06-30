import '../styles/globals.css'
import { SnackbarProvider } from 'notistack';
import { StoreProvider } from '/utils/StoreProvider';

function MyApp({ Component, pageProps }) {
  
  return (
    <StoreProvider {...pageProps}>
        <SnackbarProvider maxSnack={3}>
          <Component {...pageProps} />
        </SnackbarProvider>
    </StoreProvider>
  );
}

export default MyApp
