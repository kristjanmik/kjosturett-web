const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');

const copyFile = promisify(fs.copyFile);

(async () => {
  console.log('Build:Copy - Working');
  const paths = await globby(['./build/*']);

  paths.forEach(path => {
    // console.log('path', path, path.replace('./build', '../src/lib/data'));
    copyFile(path, path.replace('./build', '../src/lib/data'));
  });
  console.log('Build:Copy - Done');
})();
