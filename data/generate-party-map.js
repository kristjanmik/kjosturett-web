const fs = require('fs');
const uuid = require('uuid');
const { promisify } = require('util');
const data = require('./build/parties.json');
const statFile = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

const filePath = '../.party-answer-map.json';
(async () => {
  let hasFile = false;

  try {
    hasFile = (await statFile(filePath)).isFile();
  } catch (e) {}

  if (hasFile)
    throw new Error(
      'Not proceeding as the script would overwrite current mapping'
    );

  const mapping = {};

  data.forEach(party => {
    mapping[party.url] = uuid.v4();
  });

  await writeFile(filePath, JSON.stringify(mapping, null, 0), error => {
    if (error) return console.error(error);
  });

  console.log('Generate:Party Map - Done');
  process.exit(0);
})();
