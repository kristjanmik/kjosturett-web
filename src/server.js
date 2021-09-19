import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import express from 'express';
import bodyParser from 'body-parser';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import Redis from 'ioredis';
import * as uuid from 'uuid';

import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';
// import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import config from './config';
import kjorskra from './lib/kjorskra';
import { setRuntimeVariable } from './actions/runtime';

let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(
    process.env.REDIS_URL,
    process.env.REDIS_URL.includes('rediss://')
      ? {
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {}
  );
} else {
  console.error(
    'WARNING YOU ARE RUNNING THIS PROJECT WITHOUT PERMANENTLY STORING REPLY DATA'
  );
}

let s3;
let upload;

if (process.env.NODE_ENV === 'production') {
  s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  });
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET,
      acl: 'public-read',
      key: async function(req, file, cb) {
        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
          return cb(new Error('Wrong filetype'));

        const token = req.query.token;
        if (!uuid.validate(token))
          throw Error(
            'Rangt auðkenni. Hafðu samband við kjosturett@kjosturett.is ef þetta er röng villa.'
          );
        const ssn = await redis.get(`candidate-token:${token}`);

        if (!ssn)
          return cb(
            new Error(
              'Rangur hlekkur. Hafðu samband við kjosturett@kjosturett.is ef þetta er röng villa.'
            )
          );

        cb(null, `candidates/${ssn}.jpg`);
      },
    }),
  });
} else {
  upload = multer({ dest: 'uploads/' });
}

const app = express();

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (__DEV__) {
  app.enable('trust proxy');
}

app.get('/og-image-kjorskra/:coordinates', (req, res) => {
  const { coordinates } = req.params;
  const url = `https://kjosturett-is.imgix.net/og_kjorskra3.png?markalign=right%2Cmiddle&mark=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fstaticmap%3Fcenter%3D${coordinates}%26zoom%3D14%26size%3D600x630%26maptype%3Droadmap%26markers%3Dicon%3Ahttps%3A%2F%2Fimgix.kjosturett.is%2Fmap_marker3.png%7C${coordinates}`;
  res.redirect(301, url);
});

app.get('/kjorskra-lookup/:kennitala', (req, res, next) => {
  kjorskra(req.params.kennitala).then(d => res.json(d), next);
});

/**
 * Used to candidate profile upload
 */
app.post('/candidate/avatar', upload.single('avatar'), (req, res) => {
  if (!req.query.token)
    return res.json({
      success: false,
      error: 'Failed to upload photo, missing token',
    });

  res.redirect(`/svar?token=${req.query.token}&upload=success`);
});

// Used to gather replies from candidates and parties
app.post('/konnun/replies', async (req, res) => {
  if (Date.now() > 1632614400000) {
    return res.json({
      success: false,
      error: 'Kosningarnar eru búnar',
    });
  }

  const { token, reply } = req.body;

  const timestamp = Math.round(Date.now() / 1000);

  await redis.set(`poll:private:${token}:${timestamp}`, reply);
  res.json({ success: true });
});

// Used to gather replies from voters in an anonymous way
app.post('/konnun/replies/all', async (req, res) => {
  const { reply } = req.body;

  const token = uuid.v4();
  const timestamp = Math.round(Date.now() / 1000);

  await redis.set(`poll:public:${token}:${timestamp}`, reply);
  res.json({ success: true });
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {};

    const store = configureStore(initialState, {
      fetch,
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      })
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html

    // console.log('in here creating context with', req.headers.cookie, req.user);
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context} store={store}>
        {route.component}
      </App>
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
