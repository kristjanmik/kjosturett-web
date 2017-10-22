/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      load: () => import(/* webpackChunkName: 'frontpage' */ './frontpage'),
    },
    {
      path: '/kosningaprof',
      load: () => import(/* webpackChunkName: 'prof' */ './prof'),
    },
    {
      path: '/kosningaprof/:nidurstodur',
      load: () =>
        import(/* webpackChunkName: 'prof-nidurstodur' */ './prof-nidurstodur'),
    },
    {
      path: '/malefni',
      load: () => import(/* webpackChunkName: 'malefni' */ './malefni'),
    },
    {
      path: '/verkefnid',
      load: () => import(/* webpackChunkName: 'about' */ './about'),
    },
    {
      path: '/malefni/:malefni',
      load: () =>
        import(/* webpackChunkName: 'malefnisingle' */ './malefnisingle'),
    },
    {
      path: '/flokkur/:party',
      load: () => import(/* webpackChunkName: 'partysingle' */ './partysingle'),
    },
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    {
      path: '*',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next()

    // Provide default values for title, description etc.
    route.title = route.title || 'Kjóstu rétt'
    route.description = route.description || ''

    return route
  },
}

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  })
}

export default routes
