import React from 'react';
import FyrriKosningar from './FyrriKosningar';
import Layout from '../../components/Layout';

export default ({ url }) => ({
  chunks: ['fyrri-kosningar'],
  title: 'Fyrri kosningar á Kjóstu rétt',
  description: 'Skoðaðu fyrri kosningar, málefni og stjórnmálaflokka.',
  path: url,
  component: (
    <Layout page="fyrri-kosningar" title="Fyrri kosningar">
      <FyrriKosningar />
    </Layout>
  ),
});
