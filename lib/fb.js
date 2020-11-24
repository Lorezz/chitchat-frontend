import * as queryString from 'query-string';

const fbParams = queryString.stringify({
  client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
  scope: 'email', // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup'
});

export const facebookLoginUrl = `https://www.facebook.com/v8.0/dialog/oauth?${fbParams}`;
