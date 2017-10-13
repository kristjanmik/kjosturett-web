// @flow

const URL = 'https://assets.kjosturett.is';

export function getAssetUrl(...assets: Array<string>) {
  return `${URL}/${assets.join('/')}.png`;
}
