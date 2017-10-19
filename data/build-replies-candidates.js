const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Replies Candidates - Building');
  const paths = await globby(['./parties/**/candidates.json']);

  let replies = [];

  paths.forEach(path => {
    let candidates = require(path);

    candidates = candidates
      .filter(candidate => candidate.svar)
      .map(({ nafn, svar }) => ({
        n: nafn,
        r: svar
      }));
    replies = [...replies, ...candidates];
  });

  await writeFile(
    './build/replies-candidates.json',
    JSON.stringify(replies, null, 0)
  );
  console.log('Build:Replies Candidates - Done');
})();
