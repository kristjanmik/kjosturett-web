import React from 'react';
import { match } from 'election-compass-match';
import { parseAnswerToSVT } from '../../svt-process-replies';
import CompareParties from './CompareParties';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import parties from '../../../data/build/replies-parties.json';
import { cleanAnswer } from '../../utils';

parties.sort(function(a, b) {
  if (a.letter > b.letter) return 1;
  if (a.letter < b.letter) return -1;
  return 0;
});

const partyLetters = ['B', 'C', 'D', 'F', 'M', 'J', 'P', 'S', 'V', 'Y', 'L'];

const valueMap = {
  0: -1,
  1: -0.5,
  2: 0.5,
  3: 1,
  6: null,
};

export default ({ url, params }) => {
  let { letters } = params;

  if (!letters) letters = '';

  letters = letters.split('').filter(letter => partyLetters.includes(letter));

  //Begin calculations
  let filterParties = letters
    .map(letter => parties.filter(party => party.letter === letter)[0])
    .map(party => {
      return { ...party, reply: party.reply.split(',') };
    });

  const replies = filterParties.map(party => party.reply);
  const SVTreplies = filterParties.map(party => parseAnswerToSVT(party.reply));

  const replyScore = SVTreplies.reduce((scores, partyReply, index) => {
    for (
      let innerIndex = index + 1;
      innerIndex < SVTreplies.length;
      innerIndex++
    ) {
      const partyTwoReply = SVTreplies[innerIndex];
      scores.push(match(partyReply, partyTwoReply) * 100);
    }
    return scores;
  }, []);

  const replyDistance = questions.map((_, i) => {
    let min = Infinity;
    let max = -Infinity;
    replies.forEach(reply => {
      const part = valueMap[cleanAnswer(reply[i])];
      if (part < min) min = part;
      if (part > max) max = part;
    });
    return Math.abs(max - min);
  });
  const score = Math.min(...replyScore);

  let title = 'Hversu líkir eru flokkarnir?';
  let description =
    'Nú getur þú borið saman flokkana í ýmsum málum. Hvaða stjórnarmeirihlutar eru líklegir? Prófaðu þig áfram!';

  return {
    chunks: ['compare-parties'],
    title,
    description,
    path: url,
    component: (
      <Layout page="bera-saman" title="Hversu líkir eru flokkarnir?">
        <CompareParties
          parties={parties}
          questions={questions}
          filterParties={filterParties}
          score={score}
          replyDistance={replyDistance}
          url={url}
        />
      </Layout>
    ),
  };
};
