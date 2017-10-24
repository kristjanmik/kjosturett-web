import path from 'path';
import { appendFile } from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';

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
import { setRuntimeVariable } from './actions/runtime';

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

app.get('/open-kjosturett-2017-live', (req, res) => {
  res.redirect('/');
});

app.get('/og-image-kjorskra/:coordinates', (req, res) => {
  const { coordinates } = req.params;
  const url = `https://kjosturett-is.imgix.net/og_kjorskra3.png?markalign=right%2Cmiddle&mark=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fstaticmap%3Fcenter%3D%C3%A1rb%C3%A6jarsk%C3%B3li%2Creykjav%C3%ADk%26zoom%3D14%26size%3D600x630%26maptype%3Droadmap%26markers%3Dicon%3Ahttps%3A%2F%2Fimgix.kjosturett.is%2Fmap_marker3.png%7C${coordinates}`;
  res.redirect(301, url);
});

const hackRoute = (req, res) => {
  res.redirect('https://github.com/kristjanmik/kjosturett-web');
};

app.get('/hakk', hackRoute);
app.get('/hack', hackRoute);
app.get('/hackaton', hackRoute);
app.get('/hackathon', hackRoute);

//This is an append only file
const repliesPath = path.resolve(__dirname, '../../replies.log');

app.post('/konnun/replies', (req, res) => {
  const { token, reply } = req.body;

  const obj = {
    token,
    reply,
    timestamp: Math.round(Date.now() / 1000)
  };

  appendFile(repliesPath, `${JSON.stringify(obj)}\n`, error => {
    if (error) return next(error);

    res.json({
      success: true
    });
  });
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
      cookie: req.headers.cookie
    });

    const initialState = {};

    const store = configureStore(initialState, {
      fetch
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now()
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
      storeSubscription: null
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query
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
      state: context.store.getState()
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
