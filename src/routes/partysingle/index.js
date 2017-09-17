import React from 'react';
import PartySingle from './PartySingle';
import Layout from '../../components/Layout';
import parties from '../../lib/data/parties.json';

export default ({ params }) => {
  const party = parties.filter(party => party.url === params.party)[0];

  if (!party) throw Error('Not found');

  let categories = [];
  try {
    categories = require(`../../lib/data/${party.url}.json`);
  } catch (e) {
    console.error(e);
  }

  return {
    chunks: ['partysingle'],
    title: `${party.name} - Kjóstu Rétt`,
    component: (
      <Layout page="flokkar">
        <PartySingle party={party} categories={categories} />
      </Layout>
    )
  };
};
