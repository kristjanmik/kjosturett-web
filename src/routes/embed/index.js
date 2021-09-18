import React from 'react';
import KosningaProf from '../prof-nidurstodur/KosningaProf';
import questions from '../../../data/poll/questions.json';
import Container from '../../components/Container';
import answers from '../../../data/poll/answers.json';
import s from './Embed.scss';

export default ({ url }) => ({
  chunks: ['prof'],
  title: `Taktu kosningapróf Vísis og kjósturétt.is!`,
  description:
    'Hvaða flokkar og frambjóðendur eru þér algjörlega sammála? Þú getur þreytt prófið og komist að áreiðanlegri niðurstöðu.',
  path: url,
  ogImage: 'https://assets.kjosturett.is/og_prof.png',
  component: (
    <Container>
      <div className={s.root}>
        <KosningaProf
          isEmbedded
          title="Kjóstu rétt og Vísis"
          answers={answers}
          questions={questions}
        />
      </div>
    </Container>
  )
});
