import getResultsBySVTScore from './svt-process-replies';
import { decodeAnswersToken } from './utils';

describe('ProcessPoliticsTest: Candiate match ', () => {
  // random answer
  const answers = 'MSEsMCwzLDIhLDMsMSEsMCwyLDAhLDEsMiwzIQo=';
  // 2,0,1,1,0,0,1,2,2,2,3,3
  const answerWithoutExclimation = 'MiwwLDEsMSwwLDAsMSwyLDIsMiwzLDM=';

  // all 0
  const zeroAnswer = 'MCwwLDA=';

  const fakeReplies = [{ reply: '3!,0,1,1!,0,0!,1,2,2!,2,3,3!' }];
  const fakeRepliesWithoutExclimation = [{ reply: '3,0,1,1,0,0,1,2,2,2,3,3' }];
  const allThreeReply = [{ reply: '3,3,3' }];
  const allZeroReply = [{ reply: '0,0,0' }];

  it('should calculate correct rating', () => {
    const candidates = getResultsBySVTScore(
      decodeAnswersToken(answers),
      fakeReplies
    );
    expect(candidates[0].score).toBe(39.42307692307692);
  });

  it('should calculate 0 rating', () => {
    const candidates = getResultsBySVTScore(
      decodeAnswersToken(zeroAnswer),
      allThreeReply
    );
    expect(candidates[0].score).toBe(0);
  });

  it('should calculate 100 rating', () => {
    const candidates = getResultsBySVTScore(
      decodeAnswersToken(zeroAnswer),
      allZeroReply
    );
    expect(candidates[0].score).toBe(100);
  });

  it('should not return same value as "!" has an effect', () => {
    const candidates = getResultsBySVTScore(
      decodeAnswersToken(answerWithoutExclimation),
      fakeRepliesWithoutExclimation
    );
    const candidates2 = getResultsBySVTScore(
      decodeAnswersToken(answerWithoutExclimation),
      fakeReplies
    );
    expect(candidates[0].score).not.toBe(candidates2[0].score);
  });
});
