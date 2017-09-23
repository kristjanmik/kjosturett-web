// @flow

const URL = 'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is';

export function getAssetUrl(type: string, asset: string) {
  return `${URL}/${type}/${asset}.png`;
}
