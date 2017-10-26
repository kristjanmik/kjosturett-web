const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const slugify = require('slugify');

const writeFile = promisify(fs.writeFile);
const statFile = promisify(fs.stat);

(async () => {
  console.log('Build:Candidates - Building');
  const paths = await globby(['./parties/**/candidates2.json']);

  let out = [];

  paths.forEach(path => {
    let candidates = require(path);

    out = [...out, ...candidates];
  });

  out = await Promise.all(
    out.map(async candidate => {
      let hasImage = false;
      const slug = slugify(candidate.name).toLowerCase();
      try {
        const fileInfo = await statFile(`./candidates-images/jpg/${slug}.jpg`);
        hasImage = fileInfo.isFile();
      } catch (e) {}

      return {
        ...candidate,
        hasImage
      };
    })
  );

  await writeFile('./build/candidates2.json', JSON.stringify(out, null, 0));
  console.log('Build:Candidates - Done');
})();
