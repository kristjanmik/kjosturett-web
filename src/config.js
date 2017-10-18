/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

let googleTrackingId;

if (process.env.NODE_ENV !== 'development') {
  googleTrackingId = 'UA-39870444-1';
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl:
      process.env.API_CLIENT_URL ||
      `http://localhost:${process.env.PORT || 3000}` ||
      '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Web analytics
  analytics: {
    googleTrackingId,
  },
};
