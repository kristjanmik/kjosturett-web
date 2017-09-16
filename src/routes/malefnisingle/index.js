import React from 'react';
import MalefniSingle from './MalefniSingle';
import Layout from '../../components/Layout';
import categories from '../../lib/data/categories.json';

export default ({ params }) => {
  const category = categories.filter(
    category => category.url === params.malefni
  )[0];

  if (!category) throw Error('Not found');

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
      <Layout>
        <MalefniSingle
          parties={parties}
          categories={categories}
          selectedCategory={params.malefni}
        />
      </Layout>
    )
  };
};
