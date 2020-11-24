import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/core';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <ColorModeScript initialValue="light" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
