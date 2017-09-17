import React from 'react';
import MalefniSingle from './MalefniSingle';
import Layout from '../../components/Layout';
import parties from '../../lib/data/parties.json';

export default ({ params }) => {
  const party = parties.filter(party => party.url === params.party)[0];

  if (!party) throw Error('Not found');

  let parties = [];
  try {
    parties = require(`../../lib/data/${params.malefni}.json`);
  } catch (e) {
    console.error(e);
  }

  return {
    chunks: ['malefnisingle'],
    title: `${category.name} - Kjóstu Rétt`,
    component: (
      <Layout page="malefni">
        <MalefniSingle
          parties={parties}
          categories={categories}
          selectedCategory={params.malefni}
        />
      </Layout>
    )
  };
};
