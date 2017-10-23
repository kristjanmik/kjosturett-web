import React from 'react';
import PartySingle from './PartySingle';
import Layout from '../../components/Layout';
import parties from '../../../data/build/parties.json';
import candidates from '../../../data/build/candidates.json';
import { pleasantUrl } from '../../utils';

export default ({ params }) => {
  const party = parties.filter(party => party.url === params.party)[0];
  const partyCandidates = candidates.filter(candidate => candidate.bokstafur === party.letter)
  console.log(party)
  console.log(candidates)
  console.log(partyCandidates)
  
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
    description: `Upplýsingar um stefnumál ${party.nameDeflected} á mannamáli fyrir Alþingiskosningarnar 2017`,
    path: `/flokkur/${party.url}`,
    component: (
      <Layout
        title={party.name}
        altTitle={
          <a href={party.website} target="_blank">
            {pleasantUrl(party.website)}
          </a>
        }
      >
        <PartySingle party={party} categories={categories} partyCandidates={partyCandidates} />
      </Layout>
    )
  };
};
