import ruvCandidates from '../data/build/replies-candidates.json';
import getResultsByScore from './process-replies';
import { decodeAnswersToken } from './utils';

describe('ProcessPoliticsTest: Candiate match ', () => {
  const answers = '1mm4u75:2d9heev:2jvmtsf';

  it('should calculate correct rating', () => {
    const candidates = getResultsByScore(
      decodeAnswersToken(answers),
      ruvCandidates,
    );
    expect(candidates).toMatchSnapshot();
  });
});
