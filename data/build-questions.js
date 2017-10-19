const fs = require('fs');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);

(async () => {
  console.log('Build:Copy - Working');
  copyFile('./', path.replace('./build', '../src/lib/data'));
  console.log('Build:Copy - Done');
})();
