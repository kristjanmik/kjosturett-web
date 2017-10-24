import { encodeAnswersToken, decodeAnswersToken } from './utils';

describe('answers token', () => {
  it('should encode/decode answers correctly', () => {
    const answers = '11254112345123451234512345123432452432'.split('');
    const token = encodeAnswersToken(answers);
    expect(decodeAnswersToken(token)).toEqual(answers);
  });

  it('should encode/decode answers correctly', () => {
    const answers = '55555555555555555555555555555555555555'.split('');
    const token = encodeAnswersToken(answers);
    expect(decodeAnswersToken(token)).toEqual(answers);
  });

  it('should decode answers correctly', () => {
    const encodedAnswers = '494q2639:494q2639:16jb8lowm';
    const correctDecodedAnswer = '3333333333333333333333333333333333334';

    expect(decodeAnswersToken(encodedAnswers).join('')).toEqual(
      correctDecodedAnswer,
    );
  });
});
