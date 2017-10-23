import React from 'react';
import KosningaProf from './KosningaProf';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';

export default () => ({
  chunks: ['prof'],
  title: `Kjóstu Rétt - Kosningapróf`,
  path: `/kosningaprof`,
  component: (
    <Layout page="kosningaprof">
      <KosningaProf answers={answers} questions={questions} />
    </Layout>
  ),
});
