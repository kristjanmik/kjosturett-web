import React from 'react';
import PartySingle from './PartySingle';
import Layout from '../../components/Layout';
import parties from '../../../data/build/parties.json';
import { pleasantUrl } from '../../utils';

export default ({ params, url }) => {
  const party = parties.filter(party => party.url === params.party)[0];

  if (!party) throw Error('Not found');

  let categories = [];
  try {
    categories = require(`../../../data/build/${party.url}.json`);
  } catch (e) {
    console.error(e);
  }

  return {
    chunks: ['partysingle'],
    title: `${party.name} - Kjóstu Rétt`,
    description: `Upplýsingar um stefnumál ${party.nameDeflected} á mannamáli fyrir Alþingiskosningarnar 2021`,
    path: url,
    component: (
      <Layout
        title={party.name}
        color={party.color}
        altTitle={
          <a href={party.website} target="_blank">
            {pleasantUrl(party.website)}
          </a>
        }
      >
        <PartySingle party={party} categories={categories} />
      </Layout>
    )
  };
};
