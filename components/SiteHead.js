import NextHead from 'next/head';

const baseUrl = process.env.NEXT_PUBLIC_CURRENT_HOST;
const defaultTitle = 'ChitChat – A multiroom chat demo.';
const defaultDescription = `ChitChat is a mobile-first, full-stack web application demo done for a dev challenge. It's a multi-room chat that has the ability to send images and voice messages, in addition to normal text messages. Developed for fun by Lorezz`;
const defaultOGURL = `${baseUrl}`;
const defaultOGImage = `${baseUrl}/og.png`;

const Head = (props) => {
  const { title, description, url, ogImage } = props;

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1,maximum-scale=1"
      />
      <meta content="/favicons/browserconfig.xml" name="msapplication-config" />
      <link href="/favicons/favicon.ico" rel="shortcut icon" />
      <link rel="manifest" href="/manifest.json" />
      <link
        href="/favicons/apple-icon-180x180.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicons/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicons/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />

      <meta property="og:url" content={url || defaultOGURL} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:site" content={url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || defaultOGImage} />
      <meta property="og:image" content={ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1619" />
      <meta property="og:image:height" content="851" />
    </NextHead>
  );
};

export default Head;
