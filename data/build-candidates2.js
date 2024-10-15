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
      let hasVideo = false;
      const slug = slugify(candidate.name).toLowerCase();
      try {
        const fileInfo = await statFile(`./candidates-images/jpg/${slug}.jpg`);
        hasImage = fileInfo.isFile();
      } catch (e) {}

      try {
        const fileInfo = await statFile(`./candidates-videos/mp4/${slug}.mp4`);
        hasVideo = fileInfo.isFile();
      } catch (e) {}

      //@TODO compress variables to save space
      return {
        ...candidate,
        hasImage,
        hasVideo,
      };
    })
  );

  await writeFile('./build/candidates2.json', JSON.stringify(out, null, 0));
  console.log('Build:Candidates - Done');
})();
