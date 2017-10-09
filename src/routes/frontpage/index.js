import React from 'react';
import Frontpage from './Frontpage';
import Layout from '../../components/Layout';
import isOpen from '../../lib/isOpen';

export default ({ query }) => {
  console.log('what is isopen', isOpen());

  if (!isOpen()) {
    return { redirect: '/opnum-fljotlega' };
  }

  return {
    chunks: ['frontpage'],
    title: `Kjóstu rétt 2017`,
    component: (
      <Layout page="flokkar">
        <Frontpage />
      </Layout>
    )
  };
};
