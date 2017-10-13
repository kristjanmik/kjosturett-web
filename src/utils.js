// @flow

const URL = 'https://assets.kjosturett.is';

export function getAssetUrl(...assets: Array<string>) {
  return `${URL}/${assets.join('/')}.png`;
}

export function pleasantUrl(url: string) {
  return url.replace(/^(https?:)?\/\/(www\.)?/i, '').replace(/\/$/, '');
}
