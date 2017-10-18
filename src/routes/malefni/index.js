import React from 'react';
import Malefni from './Malefni';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['malefni'],
  title: 'Málefnaflokkar - Kjóstu Rétt',
  component: (
    <Layout page="malefni">
      <Malefni />
    </Layout>
  ),
});
