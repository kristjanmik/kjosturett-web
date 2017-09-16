import React from 'react';
import Frontpage from './Frontpage';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['frontpage'],
  title: `Kjóstu rétt 2017`,
  component: (
    <Layout>
      <Frontpage />
    </Layout>
  )
});
