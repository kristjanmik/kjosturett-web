const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Replies Parties - Building');
  const paths = await globby(['./parties/**/data.json']);

  const replies = paths
    .map(path => {
      const party = require(path);
      return party.reply ? party : null;
    })
    .filter(party => party);

  await writeFile(
    './build/replies-parties.json',
    JSON.stringify(replies, null, 0),
  );
  console.log('Build:Replies Parties - Done');
})();
