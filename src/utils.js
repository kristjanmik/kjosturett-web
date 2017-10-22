// @flow

const URL = 'https://assets.kjosturett.is';

export function getAssetUrl(...assets: Array<string>) {
  return `${URL}/${assets.join('/')}.png`;
}

export function pleasantUrl(url: string) {
  return url.replace(/^(https?:)?\/\/(www\.)?/i, '').replace(/\/$/, '');
}

export function encodeAnswersToken(answers) {
  const chunkLength = Math.floor(answers.length / 3);

  const first = parseInt(answers.slice(0, chunkLength).join(''), 10).toString(
    36,
  );
  const second = parseInt(
    answers.slice(chunkLength, chunkLength * 2).join(''),
    10,
  ).toString(36);
  const third = parseInt(
    answers.slice(chunkLength * 2, answers.length).join(''),
    10,
  ).toString(36);

  return `${first}:${second}:${third}`;
}

export function decodeAnswersToken(token) {
  const decode = part =>
    parseInt(part, 36)
      .toString()
      .split('');
  return token
    .split(':')
    .map(decode)
    .reduce((a, b) => a.concat(b), []);
}
