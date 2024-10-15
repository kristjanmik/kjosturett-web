import React from 'react';
import Frontpage from './Frontpage';
import Layout from '../../components/Layout';

export default ({ url }) => ({
  chunks: ['frontpage'],
  title: 'Kjóstu rétt - Alþingiskosningar 2024',
  description: 'Allir stjórnmálaflokkarnir í Alþingiskosningunum 2024',
  path: url,
  component: (
    <Layout page="flokkar">
      <Frontpage />
    </Layout>
  ),
});
