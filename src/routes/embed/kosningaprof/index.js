import React from 'react';
import KosningaProf from '../../prof-nidurstodur/KosningaProf';
import questions from '../../../../data/poll/questions.json';
import answers from '../../../../data/poll/answers.json';
import Layout from '../../../components/Layout';

export default ({ url }) => ({
  chunks: ['embed-prof'],
  title: `Kosningapróf Kjóstu rétt`,
  description:
    'Hvaða flokkar og frambjóðendur eru þér algjörlega sammála? Þú getur þreytt prófið og komist að áreiðanlegri niðurstöðu.',
  path: url,
  ogImage: 'https://assets.kjosturett.is/og_prof.png',
  component: (
    <Layout isEmbed>
      <KosningaProf
        isEmbedded
        title="Kosningapróf Kjóstu rétt"
        answers={answers}
        questions={questions}
      />
    </Layout>
  ),
});
