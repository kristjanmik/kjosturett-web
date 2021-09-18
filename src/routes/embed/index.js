import React from 'react';
import KosningaProf from '../prof-nidurstodur/KosningaProf';
import questions from '../../../data/poll/questions.json';
import answers from '../../../data/poll/answers.json';

export default ({ url }) => ({
  chunks: ['prof'],
  title: `Taktu kosningapróf Vísis og kjósturétt.is!`,
  description:
    'Hvaða flokkar og frambjóðendur eru þér algjörlega sammála? Þú getur þreytt prófið og komist að áreiðanlegri niðurstöðu.',
  path: url,
  ogImage: 'https://assets.kjosturett.is/og_prof.png',
  component: <KosningaProf isEmbedded answers={answers} questions={questions} />
});
