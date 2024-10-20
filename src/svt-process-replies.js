import { parseAnswers, match } from 'election-compass-match';

// Based on https://github.com/svt/election-compass-match/

const sortByRating = (a, b) => b.score - a.score;

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
  return answers
    .split('')
    .slice(0, 37) // this is only here temporarily to test old answers compared to the 37 new questions
    .map(answer => {
      // 6 means the user skipped it or didnt answer it
      if (answer === '6') {
        return null;
      }
      // SVT uses 4-level Likert scale by default while we use 5 level
      // To make it work with the 5-level scale we need to set the type as range
      return { 
        selectedIndex: answer - 1,
        // Used to test out the scale
        isImportant: Math.random() < 0.5,
        type: 'RANGE' 
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
