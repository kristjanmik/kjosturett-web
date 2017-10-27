import React from 'react';
import CompareParties from './CompareParties';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import parties from '../../../data/build/replies-parties.json';

export default ({ url }) => {
  return {
    chunks: ['compare-parties'],
    title: 'Hversu líkir eru flokkarnir?',
    description:
      'Nú getur þú borið saman flokkana í ýmsum málum. Hvaða stjórnarmeirihlutar eru líklegir? Prófaðu þig áfram!',
    path: url,
    component: (
      <Layout page="bera-saman" title="Hversu líkir eru flokkarnir?">
        <CompareParties parties={parties} questions={questions} />
      </Layout>
    )
  };
};
