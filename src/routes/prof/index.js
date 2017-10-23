import React from 'react';
import KosningaProf from './KosningaProf';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';

export default ({ params, url }) => {
  return {
    chunks: ['prof'],
    title: `Kjóstu Rétt - Kosningapróf`,
    path: url,
    component: (
      <Layout page="prof" showHeader={false}>
        <KosningaProf questions={questions} />
      </Layout>
    )
  };
};
