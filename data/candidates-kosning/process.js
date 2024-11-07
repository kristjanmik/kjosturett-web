//https://www.landskjor.is/media/althingiskosningar/Auglysing-frambjodenda-2021.pdf
//https://assets.ctfassets.net/8k0h54kbe6bj/1gtENqhJYNkfpbwfGjCMnv/7678c549ba1093e4d051a53abd20b71e/Augl_sing_frambo_slista_til_Al_ingis_2024.pdf
//Process the pdf of all candidates from landskjörstjórn
const fs = require('fs');
const raw = fs.readFileSync('./candidates_raw.txt').toString();

const partyMap = {
  B: 'framsoknarflokkurinn',
  C: 'vidreisn',
  D: 'sjalfstaedisflokkurinn',
  F: 'flokkur-folksins',
  J: 'sosialistaflokkurinn',
  L: 'lydraedisflokkurinn',
  M: 'midflokkurinn',
  P: 'piratar',
  S: 'samfylkingin',
  V: 'vinstri-graen',
  Y: 'abyrg-framtid',
};

const kjordaemiMap = {
  NORÐVESTURKJÖRDÆMI: 'nordvesturkjordaemi',
  NORÐAUSTURKJÖRDÆMI: 'nordausturkjordaemi',
  SUÐURKJÖRDÆMI: 'sudurkjordaemi',
  SUÐVESTURKJÖRDÆMI: 'sudvesturkjordaemi',
  'REYKJAVÍKURKJÖRDÆMI SUÐUR': 'reykjavik-sudur',
  'REYKJAVÍKURKJÖRDÆMI NORÐUR': 'reykjavik-nordur',
};

const kjordaemiList = Object.keys(kjordaemiMap);

const results = {};

(() => {
  const data = raw.split('\n');

  let kjordaemi;
  let party;
  data.forEach((row, index) => {
    if (kjordaemiList.includes(row)) {
      //Row is a kjordaemi
      kjordaemi = kjordaemiMap[row.trim()];
      if (!kjordaemi)
        throw Error(`Invalid Kjordaemi: index: ${index} => ${row}`);
    } else if (row.includes('- listi')) {
      //Row is a party
      party = row.split('-')[0].trim();
      if (!partyMap[row.split('-')[0].trim()])
        throw Error(`Invalid Party: index: ${index} => ${row}`);
    } else {
      //Row is a candidate
      if (!results[kjordaemi]) results[kjordaemi] = {};
      if (!results[kjordaemi][party]) results[kjordaemi][party] = [];

      const split = row.split(',');

      const obj = {
        name: split[0]
          .split(' ')
          .slice(1)
          .join(' ')
          .trim(),
        occupation: '',
        place: split[split.length - 1].replace('.', ''),
        seat: row
          .split(' ')[0]
          .trim()
          .replace('.', ''),
        ssn: split[1].trim(),
        street: split[split.length - 2].trim(),
      };

      if (split.length === 2) {
        obj.street = '';
      } else if (split.length === 4) {
        obj.occupation = obj.street;
        obj.street = '';
      } else if (split.length === 5) {
        //Normal length
        obj.occupation = split[2].trim();
      } else if (split.length === 6) {
        obj.occupation = `${split[2].trim()}, ${split[3].trim()}`;
      } else if (split.length === 7) {
        obj.occupation = `${split[2].trim()}, ${split[3].trim()}, ${split[4].trim()}`;
      } else {
        throw Error('Could not parse candidate');
      }

      obj.ssn = (obj.ssn || '').replace('-', '').replace('kt. ', '');

      results[kjordaemi][party].push(obj);
    }
  });

  fs.writeFile(`./candidates.json`, JSON.stringify(results, null, 0), error => {
    if (error) return console.error(error);
  });

  const parties = {};

  for (let constituency in results) {
    for (let party in results[constituency]) {
      if (!parties[party]) parties[party] = [];

      parties[party] = [
        ...parties[party],
        ...results[constituency][party].map(d => {
          return { ...d, constituency, party, ssn: d.ssn.replace('-', '') };
        }),
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

  console.log('done');
})();
