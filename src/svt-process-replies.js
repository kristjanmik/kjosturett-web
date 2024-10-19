import { parseAnswers, match } from 'election-compass-match';

// Based on https://github.com/svt/election-compass-match/

const sortByRating = (a, b) => b.score - a.score;

function parseAnswerToSVT(answers) {
  const test = answers
    .map(answer => {
      if (answer === '6') {
        return '_';
      }
      return `${answer - 1}/5`;
    })
    .join(';');
  return parseAnswers(test);
}

function parsePoliticalAnswerToSVT(answers) {
  return answers
    .split('')
    .slice(0, 37)
    .map(answer => {
      // 6 means the user skipped it or didnt answer it
      if (answer === '6') {
        return null;
      }
      // SVT uses 4-level Likert scale by default while we use 5 level
      // To make it work with the 5-level scale we need to set the type as range
      return { selectedIndex: answer - 1, isImportant: false, type: 'RANGE' };
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
