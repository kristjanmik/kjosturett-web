import React from 'react';
import KosningaProfResults from './KosningaProfResults';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';
import candidates from '../../../data/build/candidates.json';
import parties from '../../../data/build/parties.json';
import { decodeAnswersToken } from '../../utils';

export default ({ params }) => ({
  chunks: ['prof-nidurstodur'],
  title: `Kjóstu Rétt - Kosningapróf`,
  path: `/kosningaprof/:nidurstodur`,
  component: (
    <Layout page="prof-nidurstodur">
      <KosningaProfResults
        answers={answers}
        questions={questions}
        candidates={candidates}
        parties={parties}
        results={decodeAnswersToken(params.nidurstodur)}
      />
    </Layout>
  ),
});
