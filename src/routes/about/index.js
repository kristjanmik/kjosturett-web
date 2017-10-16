import React from 'react';
import About from './About';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['about'],
  title: `Verkefnið - Kjóstu Rétt`,
  path: '/verkefnid',
  component: (
    <Layout page="verkefnid" title="Verkefnið">
      <About />
    </Layout>
  ),
});
