import React from 'react';
import KosningaProfResults from './KosningaProfResults';
import Layout from '../../components/Layout';
import questionsBase from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';
import candidateReplies from '../../../data/build/replies-candidates2.json';
import partyReplies from '../../../data/build/parties.json';
import getResultsBySVTScore from '../../svt-process-replies';
import { decodeAnswersToken } from '../../utils';

function questionAnswer(reply = []) {
  return reply.reduce((all, answer, index) => {
    all[index + 1] = parseInt(answer, 10);
    return all;
  }, {});
}

export default ({ params, url }) => {
  const replies = decodeAnswersToken(params.nidurstodur);
  console.log('here!!!', replies);
  const myAnswers = questionAnswer(replies);
  console.log('here!!!', myAnswers);
  const parties = getResultsBySVTScore(replies, partyReplies).map(party => {
    party.reply = questionAnswer((party.reply || '').split(''));
    return party;
  });
  const candidates = getResultsBySVTScore(replies, candidateReplies);
  const questions = questionsBase.map(({ id, question }) => ({
    id,
    question,
    myAnswer: myAnswers[id],
  }));

  const socialPayload = parties
    .map(party => `${party.letter}:${Math.ceil(party.score)}`)
    .join('|');

  const ogImage = `https://3t4zkdq6qr6llg66jfm7gaeog40fbpty.lambda-url.eu-west-1.on.aws/${encodeURIComponent(
    socialPayload
  )}`;

  return {
    chunks: ['prof-nidurstodur'],
    title: `Kjóstu Rétt - Kosningapróf`,
    path: url,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    component: (
      <Layout page="prof-nidurstodur" title="Kosningapróf / Niðurstöður">
        <KosningaProfResults
          answers={answers}
          questions={questions}
          candidates={candidates}
          parties={parties}
          url={`https://kjosturett.is/kosningaprof/${encodeURIComponent(
            params.nidurstodur
          )}`}
          ogImage={ogImage}
        />
      </Layout>
    ),
  };
};
