// @flow

const URL = 'https://assets.kjosturett.is';

export function getAssetUrl(...assets: Array<string>) {
  return `${URL}/${assets.join('/')}.png`;
}

export function pleasantUrl(url: string) {
  return url.replace(/^(https?:)?\/\/(www\.)?/i, '').replace(/\/$/, '');
}

export function encodeAnswersToken(answers) {
  const midpoint = answers.length / 2;
  const first = parseInt(answers.slice(0, midpoint).join(''), 10).toString(36);
  const second = parseInt(answers.slice(midpoint).join(''), 10).toString(36);
  return `${first}:${second}`;
}

export function decodeAnswersToken(token) {
  const [first, second] = token.split(':').map(part =>
    parseInt(part, 36)
      .toString()
      .split('')
  );
  return [...first, ...second];
}
