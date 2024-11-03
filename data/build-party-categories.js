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
        const statementFile = `./parties/${party.url}/${category.url}.md`;
        const categoryVideoFile = `./parties/${party.url}/category-videos.json`;

        let markdownStatement = '';
        try {
          markdownStatement = await readFile(statementFile);
          if (markdownStatement) {
            markdownStatement = marked(markdownStatement.toString());
          }
        } catch (e) {}

        let categoryVideos = {};
        //Try to load the category videos file, not required
        try {
          categoryVideos = await readFile(categoryVideoFile);
          categoryVideos = JSON.parse(categoryVideos);
        } catch (e) {}

        //Video comes from the category itself
        const p = { ...party };
        delete p.video;
        return {
          ...p,
          video: categoryVideos[category.url] || undefined,
          statement: markdownStatement || '',
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
        const statementFile = `./parties/${party.url}/${category.url}.md`;
        const categoryVideoFile = `./parties/${party.url}/category-videos.json`;

        let markdownStatement = '';
        try {
          markdownStatement = await readFile(statementFile);
          if (markdownStatement) {
            markdownStatement = marked(markdownStatement.toString());
          }
        } catch (e) {}

        let categoryVideos = {};
        //Try to load the category videos file, not required
        try {
          categoryVideos = await readFile(categoryVideoFile);
          categoryVideos = JSON.parse(categoryVideos);
        } catch (e) {}

        return {
          category: category.url,
          name: category.name,
          statement: markdownStatement || '',
          video: categoryVideos[category.url] || undefined,
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
