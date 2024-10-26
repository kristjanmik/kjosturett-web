import { parseAnswers, match } from 'election-compass-match';

// Based on https://github.com/svt/election-compass-match/

const sortByRating = (a, b) => b.score - a.score;

const numberToPropositionAnswer = {
  '0': 'A',
  '0!': 'A!',
  '1': 'B',
  '1!': 'B!',
  '2': 'C',
  '2!': 'C!',
  '3': 'D',
  '3!': 'D!',
  '6': '_',
  '6!': '_',
};

function mapNumberToPropositionAnswer(answer) {
  // Default to '_' while we switch the old test for the new
  return numberToPropositionAnswer[answer] || '_';
}

function parseAnswerToSVT(answers) {
  const svtAnswer = answers.map(mapNumberToPropositionAnswer).join(';');
  return parseAnswers(svtAnswer);
}

export default function getResultsBySVTScore(userAnswer, politialEntityAnswer) {
  const userAnswerSVT = parseAnswerToSVT(userAnswer);
  return politialEntityAnswer
    .map(data => {
      if (data.reply) {
        const politialEntityAnswerSVT = parseAnswerToSVT(data.reply.split(''));
        return {
          ...data,
          score: match(userAnswerSVT, politialEntityAnswerSVT) * 100,
        };
      }
      return {
        ...data,
        score: 0,
      };
    })
    .sort(sortByRating);
}
