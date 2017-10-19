import { encodeAnswersToken, decodeAnswersToken } from './utils';

describe('answers token', () => {
  it('should encode/decode answers correctly', () => {
    const answers = '112541123451234512345123451234'.split('');
    const token = encodeAnswersToken(answers);
    expect(decodeAnswersToken(token)).toEqual(answers);
  });
});
