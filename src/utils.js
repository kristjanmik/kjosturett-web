// @flow

const URL = 'https://assets.kjosturett.is';

exports.getAssetUrl = (...assets) => {
  return `${URL}/${assets.join('/')}.png`;
};

exports.candidateImage = slug => {
  return `https://kjosturett-is.imgix.net/${slug}.jpg?fit=facearea&facepad=2.0&w=500&h=500`;
};

exports.pleasantUrl = url => {
  return url.replace(/^(https?:)?\/\/(www\.)?/i, '').replace(/\/$/, '');
};

exports.encodeAnswersToken = answers => {
  const chunkLength = Math.floor(answers.length / 3);

  const first = parseInt(answers.slice(0, chunkLength).join(''), 10).toString(
    36
  );
  const second = parseInt(
    answers.slice(chunkLength, chunkLength * 2).join(''),
    10
  ).toString(36);
  const third = parseInt(
    answers.slice(chunkLength * 2, answers.length).join(''),
    10
  ).toString(36);

  return `${first}:${second}:${third}`;
};

exports.decodeAnswersToken = token => {
  const decode = part =>
    parseInt(part, 36)
      .toString()
      .split('');
  return token
    .split(':')
    .map(decode)
    .reduce((a, b) => a.concat(b), []);
};
