import React from 'react';
import KosningaProf from './KosningaProf';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions-2024.json';
import answers from '../../../data/poll/answers.json';

export default ({ params, url, query }) => {
  const { token, uploadImage, uploadVideo } = query;

  return {
    chunks: ['prof'],
    title: `Kjóstu Rétt - Kosningapróf`,
    path: url,
    component: (
      <Layout page="prof" showHeader={false}>
        <KosningaProf
          answers={answers}
          questions={questions}
          token={token}
          uploadImageSuccess={uploadImage === 'success'}
          uploadImageFailure={uploadImage === 'failure'}
          uploadVideoSuccess={uploadVideo === 'success'}
          uploadVideoFailure={uploadVideo === 'failure'}
        />
      </Layout>
    ),
  };
};
