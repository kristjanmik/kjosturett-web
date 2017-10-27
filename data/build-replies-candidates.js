const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const slugify = require('slugify');
const writeFile = promisify(fs.writeFile);
const statFile = promisify(fs.stat);

const replies = require('./poll/replies_candidates.json');
const repliesObj = {};

replies.forEach(({ kennitala, reply }) => {
  repliesObj[kennitala] = reply;
});

(async () => {
  console.log('Build:Replies Candidates - Building');
  const paths = await globby(['./parties/**/candidates2.json']);

  let out = [];

  await Promise.all(
    paths.map(async path => {
      let candidates = require(path);

      candidates = await Promise.all(
        candidates.map(async candidate => {
          const reply = repliesObj[candidate.ssn];

          if (reply) candidate.reply = reply;

          candidate.slug = slugify(candidate.name).toLowerCase();

          delete candidate.ssn;
          delete candidate.occupation;
          delete candidate.place;
          delete candidate.street;
          candidate.seat = parseInt(candidate.seat, 10);

          let hasImage = false;
          try {
            const fileInfo = await statFile(
              `./candidates-images/jpg/${candidate.slug}.jpg`
            );
            hasImage = fileInfo.isFile();
          } catch (e) {}

          candidate.hasImage = hasImage;

          return candidate;
        })
      );
      out = [...out, ...candidates];
    })
  );

  await writeFile(
    './build/replies-candidates2.json',
    JSON.stringify(out, null, 0)
  );

  console.log('Build:Replies Candidates - Done');
})();
