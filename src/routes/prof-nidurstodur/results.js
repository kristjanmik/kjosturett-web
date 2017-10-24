import React from 'react';
import KosningaProfResults from './KosningaProfResults';
import Layout from '../../components/Layout';
import questionsBase from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';
import candidateReplies from '../../../data/build/replies-candidates2.json';
import partyReplies from '../../../data/build/parties.json';
import getResultsByScore from '../../process-replies';
import { decodeAnswersToken } from '../../utils';

function questionAnswer(reply = []) {
  return reply.reduce((all, answer, index) => {
    all[index + 1] = parseInt(answer, 10);
    return all;
  }, {});
}

export default ({ params }) => {
  const replies = decodeAnswersToken(params.nidurstodur);
  const myAnswers = questionAnswer(replies);
  const parties = getResultsByScore(replies, partyReplies).map(party => {
    party.reply = questionAnswer((party.reply || '').split(''));
    return party;
  });
  const candidates = getResultsByScore(replies, candidateReplies);
  const questions = questionsBase.map(({ id, question }) => ({
    id,
    question,
    myAnswer: myAnswers[id],
  }));

  return {
    chunks: ['prof-nidurstodur'],
    title: `Kjóstu Rétt - Kosningapróf`,
    path: `/kosningaprof/:nidurstodur`,
    component: (
      <Layout page="prof-nidurstodur" title="Kosningapróf / Niðurstöður">
        <KosningaProfResults
          answers={answers}
          questions={questions}
          candidates={candidates}
          parties={parties}
        />
      </Layout>
    ),
  };
};
