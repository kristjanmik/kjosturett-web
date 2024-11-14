import React from 'react';
import { match } from 'election-compass-match';
import { parseAnswerToSVT } from '../../svt-process-replies';
import CompareParties from './CompareParties';
import Layout from '../../components/Layout';
import questions from '../../../data/poll/questions.json';
import parties from '../../../data/build/replies-parties.json';

parties.sort(function(a, b) {
  if (a.letter > b.letter) return 1;
  if (a.letter < b.letter) return -1;
  return 0;
});

const partyDeflections = {
  B: 'Framsóknarflokksins',
  C: 'Viðreisnar',
  D: 'Sjálfstæðisflokksins',
  F: 'Flokki fólksins',
  M: 'Miðflokksins',
  J: 'Sósíalistaflokksins',
  P: 'Pírata',
  S: 'Samfylkingarinnar',
  O: 'Frjálslynda Lýðræðisflokksins',
  V: 'Vinstri grænna',
};

const partyDeflectionsB = {
  A: 'Bjarta framtíð',
  B: 'Framsóknarflokkinn',
  C: 'Viðreisn',
  D: 'Sjálfstæðisflokkinn',
  F: 'Flokk fólksins',
  M: 'Miðflokkinn',
  J: 'Sósíalistaflokkinn',
  P: 'Pírata',
  R: 'Alþýðufylkinguna',
  S: 'Samfylkinguna',
  T: 'Dögun',
  O: 'Frjálslynda Lýðræðisflokkinn',
  V: 'Vinstri græn',
};

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

  letters = letters.split('').filter(letter => !!partyDeflections[letter]);

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
      const part = valueMap[reply[i]];
      if (part < min) min = part;
      if (part > max) max = part;
    });
    return Math.abs(max - min);
  });
  const score = Math.min(...replyScore);
  const percentage = `${score.toFixed(0)}%`;

  let title = 'Hversu líkir eru flokkarnir?';
  let description =
    'Nú getur þú borið saman flokkana í ýmsum málum. Hvaða stjórnarmeirihlutar eru líklegir? Prófaðu þig áfram!';

  if (letters.length > 0) {
    const currentParties = parties.filter(party =>
      letters.includes(party.letter)
    );

    if (letters.length === 1) {
      title = `Berðu ${
        partyDeflectionsB[currentParties[0].letter]
      } saman við aðra flokka`;
      description = `Hversu samstíga eru ${currentParties[0].name} og aðrir flokkar? Þú getu skoðað málið betur hérna.`;
    } else if (letters.length === 2) {
      title = `${currentParties
        .map(p => p.name)
        .join(' og ')} eru ${percentage} samstíga`;
      description = `Skoðaðu málið betur ásamt fleiri möguleikum á kjósturétt.is.`;
    } else {
      let stjorn = currentParties
        .map(p => partyDeflections[p.letter])
        .join(', ');
      let pos = stjorn.lastIndexOf(', ');
      stjorn = `${stjorn.substring(0, pos)} og${stjorn.substring(pos + 1)}`;
      title = `Ríkisstjórnin ${letters.join('')} er ${percentage} samstíga`;
      description = `Skoðaðu betur stjórn ${stjorn} á kjósturétt.is ásamt fleiri möguleikum á kjósturétt.is.`;
    }
  }

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
