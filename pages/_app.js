import { ChakraProvider } from '@chakra-ui/core';

import { AuthProvider } from 'lib/AuthContext';
import { DataProvider } from 'lib/DataContext';
import 'assets/style.css';
// import theme from 'lib/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <AuthProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
