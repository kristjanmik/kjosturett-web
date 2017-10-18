const { writeFile } = require('fs');

const categories = require('./categories/data.json');

console.log('Build:Categories - Building');

writeFile(
  './build/categories.json',
  JSON.stringify(categories, null, 0),
  () => {
    console.log('Build:Categories - Done');
  }
);
