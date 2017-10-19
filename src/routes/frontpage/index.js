import React from 'react';
import Frontpage from './Frontpage';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['frontpage'],
  title: 'Kjóstu rétt - Alþingiskosningar 2017',
  description: 'Allir stjórnmálaflokkarnir í Alþingiskosningunum 2017',
  component: (
    <Layout page="flokkar">
      <Frontpage />
    </Layout>
  )
});
