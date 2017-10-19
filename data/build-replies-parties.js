const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Replies Parties - Building');
  const paths = await globby(['./parties/**/data.json']);
  let replies = [];

  paths.forEach(path => {
    let party = require(path);

    if (party.reply) {
      replies.push({
        n: party.name,
        r: party.reply
      });
    }
  });

  await writeFile(
    './build/replies-parties.json',
    JSON.stringify(replies, null, 0)
  );
  console.log('Build:Replies Parties - Done');
})();
