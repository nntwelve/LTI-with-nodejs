import ltijs from 'ltijs';
const lti = ltijs.Provider;
// Setup
const ltiSetupConfig = {
  LTI_KEY: process.env.LTI_KEY,
  DB_CONNECTION: {
    url:
      process.env.DATABASE_URI +
      '/' +
      process.env.DATABASE_NAME +
      '?authSource=admin',
    connection: {
      // user: process.env.DATABASE_USERNAME,
      // pass: process.env.DATABASE_PASSWORD,
    },
  },
  LTI_APP_CONFIG: {
    cookies: {
      // Set secure to true if the testing platform is in a different domain and https is being used
      secure: false,
      // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
      sameSite: '',
    },
    // Set DevMode to true if the testing platform is in a different domain and https is not being used
    devMode: true,
  },
};

// Setup LTI application
lti.setup(
  ltiSetupConfig.LTI_KEY,
  ltiSetupConfig.DB_CONNECTION,
  ltiSetupConfig.LTI_APP_CONFIG
);

// Whitelisting the main app route and /nolti to create a landing page
lti.whitelist(
  {
    route: new RegExp(/^\/nolti$/),
    method: 'get',
  },
  {
    route: new RegExp(/^\/ping$/),
    method: 'get',
  }
); // Example Regex usage

// When receiving successful LTI launch redirects to app, otherwise redirects to landing page
lti.onConnect((token, req, res) => {
  if (token) {
    return res.json(res.locals.context.custom.role);
  } else {
    lti.redirect(res, '/nolti');
  } // Redirects to landing page
});

// Setup function
lti.setUpPlatform = async () => {
  await lti.deploy({ port: process.env.PORT });

  const ltiPlatConfig = {
    url: process.env.LTI_ISS,
    name: process.env.LTI_NAME,
    clientId: process.env.LTI_CLIENT_ID,
    authenticationEndpoint: `${process.env.LTI_HOST}/api/lti/authorize_redirect`,
    accesstokenEndpoint: `${process.env.LTI_HOST}/login/oauth2/token`,
    authConfig: {
      method: 'JWK_SET',
      key: `${process.env.LTI_HOST}/api/lti/security/jwks`,
    },
  };

  await lti.registerPlatform(ltiPlatConfig);
};

export { lti };
