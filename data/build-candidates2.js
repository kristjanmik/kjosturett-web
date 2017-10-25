const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const writeFile = promisify(fs.writeFile);

(async () => {
  console.log('Build:Candidates - Building');
  const paths = await globby(['./parties/**/candidates2.json']);

  let out = [];

  paths.forEach(path => {
    let candidates = require(path);

    out = [...out, ...candidates];
  });

  await writeFile('./build/candidates2.json', JSON.stringify(out, null, 0));
  console.log('Build:Candidates - Done');
})();
