const { decodeAnswersToken } = require('../src/utils');
const questionsData = require('../data/poll/questions.json');
const repliesData = require('../data/poll/replies-voters.json');

const voteCount = repliesData.length;
const votes = {};

questionsData.map((q, index) => (votes[index + 1] = []));

repliesData.forEach(({ reply, timestamp }) => {
  decodeAnswersToken(reply).forEach((reply, index) => {
    votes[index + 1].push(parseInt(reply, 10));
  });
});

//Display results
questionsData.forEach(({ id, question }) => {
  let results = votes[id].reduce((a, b) => a + b, 0) / voteCount / 0.05; //Convert 1-5 to percentage 0-100

  // Displaying results is tricky as 50% indicates neither for nor against.
  // Everything above 50 is therefore indicated as a positive %, while everything under is indicated as a negative percentage.
  // The scale results in -100% to 100%
  results = (results - 50) * 2;

  console.log(`${results.toFixed(2)}% - ${question}`);
});
