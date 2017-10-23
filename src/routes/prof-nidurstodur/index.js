import React from 'react';
import KosningaProfResults from './KosningaProfResults';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';
import candidateReplies from '../../../data/build/replies-candidates2.json';
import partyReplies from '../../../data/build/parties.json';
import getResultsByScore from '../../process-replies';
import { decodeAnswersToken } from '../../utils';

export default ({ params }) => {
  const replies = decodeAnswersToken(params.nidurstodur);
  const parties = getResultsByScore(replies, partyReplies);
  const candidates = getResultsByScore(replies, candidateReplies);

  return {
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
          results={replies}
        />
      </Layout>
    ),
  };
};
