import React from 'react';
import KosningaProf from './KosningaProf';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';

export default ({ params, url, query }) => {
  const { token } = query;

  return {
    chunks: ['prof'],
    title: `Kjóstu Rétt - Kosningapróf`,
    path: url,
    component: (
      <Layout page="prof" showHeader={false}>
        <KosningaProf answers={answers} questions={questions} token={token} />
      </Layout>
    )
  };
};
