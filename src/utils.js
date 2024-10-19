// @flow

const URL = 'https://assets.kjosturett.is';

exports.getAssetUrl = (...assets) => {
  return `${URL}/${assets.join('/')}.png`;
};

exports.candidateImage = slug => {
  return `https://kjosturett.imgix.net/${slug}.jpg?fit=facearea&facepad=2.0&w=500&h=500`;
};

exports.pleasantUrl = url => {
  return url.replace(/^(https?:)?\/\/(www\.)?/i, '').replace(/\/$/, '');
};

exports.encodeAnswersToken = answers => {
  return Buffer.from(answers.join(',')).toString('base64');
};

exports.decodeAnswersToken = token => {
  return Buffer.from(token, 'base64')
    .toString('utf8')
    .split(',');
};
