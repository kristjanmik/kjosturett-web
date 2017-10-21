import React from 'react';
import Kjorskra from './Kjorskra';
import Layout from '../../components/Layout';

export default () => ({
  chunks: ['kjorskra'],
  title: 'Hvar á ég að kjósa? - Kjóstu Rétt',
  path: '/kjorskra',
  component: (
    <Layout page="kjorskra" title="Hvar á ég að Kjósa?">
      <Kjorskra />
    </Layout>
  )
});
