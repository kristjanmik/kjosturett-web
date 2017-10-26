import React from 'react';
import About from './About';
import Layout from '../../components/Layout';

export default ({ url }) => ({
  chunks: ['about'],
  title: 'Verkefnið - Kjóstu Rétt',
  path: url,
  component: (
    <Layout page="verkefnid" title="Verkefnið">
      <About />
    </Layout>
  )
});
