import React from 'react';
import MalefniSingle from './MalefniSingle';
import Layout from '../../components/Layout';
import categories from '../../../data/build/categories.json';

export default ({ params, url }) => {
  const category = categories.filter(
    category => category.url === params.malefni
  )[0];

  if (!category) throw Error('Not found');

  let parties = [];
  try {
    parties = require(`../../../data/build/${params.malefni}.json`);
  } catch (e) {
    console.error(e);
  }

  return {
    chunks: ['malefnisingle'],
    title: `${category.name} - Kjóstu Rétt`,
    path: url,
    description: `Svör stjórnmálaflokkanna í ${category.name.toLowerCase()}um fyrir Alþingiskosningarnar 2021`,
    component: (
      <Layout page="malefni" title={category.name}>
        <MalefniSingle
          parties={parties}
          categories={categories}
          selectedCategory={params.malefni}
        />
      </Layout>
    )
  };
};
