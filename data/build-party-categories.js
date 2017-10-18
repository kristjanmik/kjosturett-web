const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const marked = require('marked');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const categories = require('./build/categories.json');
const parties = require('./build/parties.json');

(async () => {
  console.log('Build:Party Category - Building');

  categories.forEach(async category => {
    const out = await Promise.all(
      parties.map(async party => {
        const key = `./parties/${party.url}/${category.url}.md`;

        let data = '';
        try {
          data = await readFile(key);
          data = data.toString();
        } catch (e) {
          console.error('Could not load key', key, process.cwd());
        }
        return {
          ...party,
          statement: data ? marked(data) : ''
        };
      })
    );

    writeFile(
      `./build/${category.url}.json`,
      JSON.stringify(out, null, 0),
      () => {}
    );
  });

  parties.forEach(async party => {
    const out = await Promise.all(
      categories.map(async category => {
        const key = `./parties/${party.url}/${category.url}.md`;

        let data = '';
        try {
          data = await readFile(key);
          data = data.toString();
        } catch (e) {
          console.error('Could not load key', key, process.cwd());
        }
        return {
          category: category.url,
          name: category.name,
          statement: data ? marked(data) : ''
        };
      })
    );

    fs.writeFile(
      `./build/${party.url}.json`,
      JSON.stringify(out, null, 0),
      () => {}
    );
  });

  console.log('Build:Party Category - Done');
})();
