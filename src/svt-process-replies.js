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
};

function parseAnswerToSVT(answers) {
  const rangeSVTAnswer = answers
    .map(answer => {
      if (answer === '6') {
        return '_';
      }
      return `${answer}/5`;
    })
    .join(';');
  return parseAnswers(rangeSVTAnswer);
}

function parsePoliticalAnswerToSVT(answers) {
  return answers.split('').map(answer => {
    // 6 means the user skipped it or didnt answer it
    if (answer === '6') {
      return null;
    }
    return {
      selectedIndex: answer - 1,
      type: 'RANGE',
    };
  });
}

export default function getResultsBySVTScore(userAnswer, politialEntityAnswer) {
  const userAnswerSVT = parseAnswerToSVT(userAnswer);
  return politialEntityAnswer
    .map(data => {
      if (data.reply) {
        const politialEntityAnswerSVT = parsePoliticalAnswerToSVT(data.reply);
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
