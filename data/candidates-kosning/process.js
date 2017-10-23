const data = require('./candidates.json');
const fs = require('fs');

const partyMap = {
  A: 'bjort-framtid',
  B: 'framsoknarflokkurinn',
  C: 'vidreisn',
  D: 'sjalfstaedisflokkurinn',
  F: 'flokkur-folksins',
  M: 'midflokkurinn',
  P: 'piratar',
  R: 'althydufylkingin',
  S: 'samfylkingin',
  T: 'dogun',
  V: 'vinstri-graen'
};

(() => {
  const parties = {};

  for (let constituency in data) {
    for (let party in data[constituency]) {
      if (!parties[party]) parties[party] = [];

      parties[party] = [
        ...parties[party],
        ...data[constituency][party].map(d => {
          return { ...d, constituency, party, ssn: d.ssn.replace('-', '') };
        })
      ];
    }
  }

  for (let letter in parties) {
    const filename = `../parties/${partyMap[letter]}/candidates2.json`;
    console.log('filename', filename);
    fs.writeFile(filename, JSON.stringify(parties[letter]), error => {
      if (error) return console.error(error);
      console.log('done');
    });
  }

  // console.log('parties', parties);
})();
