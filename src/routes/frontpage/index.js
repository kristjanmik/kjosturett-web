import React from 'react';
import Frontpage from './Frontpage';
import Layout from '../../components/Layout';
import isOpen from '../../lib/isOpen';

export default ({ query }) => {
  if (!isOpen()) {
    return { redirect: '/opnum-fljotlega' };
  }

  return {
    chunks: ['frontpage'],
    title: 'Kjóstu rétt - Alþingiskosningar 2017',
    description: 'Allir stjórnmálaflokkarnir í Alþingiskosningunum 2017',
    component: (
      <Layout page="flokkar">
        <Frontpage />
      </Layout>
    )
  };
};
