const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Parties - Building');
  const paths = await globby(['./parties/**/data.json']);
  let parties = [];

  paths.forEach(path => {
    parties.push(require(path));
  });

  parties.sort((a, b) => {
    if (a.letter > b.letter) return 1;
    if (a.letter < b.letter) return -1;
    return 0;
  });

  await writeFile('./build/parties.json', JSON.stringify(parties, null, 0));
  console.log('Build:Parties - Done');
})();
