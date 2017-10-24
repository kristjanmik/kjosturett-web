const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const slugify = require('slugify');
const writeFile = promisify(fs.writeFile);
const replies = require('./poll/replies_candidates.json');
const repliesObj = {};

replies.forEach(({ kennitala, reply }) => {
  repliesObj[kennitala] = reply;
});

(async () => {
  console.log('Build:Replies Candidates - Building');
  const paths = await globby(['./parties/**/candidates2.json']);

  let out = [];

  paths.forEach(path => {
    let candidates = require(path);

    candidates = candidates.map(candidate => {
      const reply = repliesObj[candidate.ssn];

      if (reply) candidate.reply = reply;

      candidate.slug = slugify(candidate.name).toLowerCase();

      return candidate;
    });
    out = [...out, ...candidates];
  });

  await writeFile(
    './build/replies-candidates2.json',
    JSON.stringify(out, null, 0)
  );

  console.log('Build:Replies Candidates - Done');
})();
