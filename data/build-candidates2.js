const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const slugify = require('slugify');

const writeFile = promisify(fs.writeFile);

let mappings;
try {
  mappings = require('./candidate-public.json');

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
        const slug = slugify(candidate.name).toLowerCase();

        return {
          ...candidate,
          assets: mappings[candidate.ssn],
        };
      })
    );

    await writeFile('./build/candidates2.json', JSON.stringify(out, null, 0));
    console.log('Build:Candidates - Done');
  })();
} catch (e) {
  console.error('Build:Candidates - Failed to load candidate mappings');
}
