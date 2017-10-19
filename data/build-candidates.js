const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Candidates - Building');
  const paths = await globby(['./parties/**/candidates.json']);

  let out = [];

  paths.forEach(path => {
    let candidates = require(path);

    out = [...out, ...candidates];
  });

  await writeFile('./build/candidates.json', JSON.stringify(out, null, 0));
  console.log('Build:Candidates - Done');
})();
