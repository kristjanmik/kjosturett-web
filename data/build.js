import fs from 'fs';
const { promisify } = require('util');
import marked from 'marked';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const categories = [
  {
    name: 'Jafnréttismál',
    url: 'jafnrettismal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/jafnrettismal.svg'
  },
  {
    name: 'Húsnæðismál',
    url: 'husnaedismal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/husnaedismal.svg'
  },
  {
    name: 'Atvinnumál',
    url: 'atvinnumal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/atvinnumal.svg'
  },
  {
    name: 'Heilbrigðismál',
    url: 'heilbrigdismal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/heilbrigdismal.svg'
  },
  {
    name: 'Skattamál',
    url: 'skattamal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/skattamal.svg'
  },
  {
    name: 'Evrópumál',
    url: 'evropumal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/evropumal.svg'
  },
  {
    name: 'Stjórnarskrármál',
    url: 'stjornarskrarmal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/stjornarskrarmal.svg'
  },
  {
    name: 'Menntamál',
    url: 'menntamal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/menntamal.svg'
  },
  {
    name: 'Sjávarútvegsmál',
    url: 'sjavarutvegsmal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/sjavarutvegsmal.svg'
  },
  {
    name: 'Umhverfismal',
    url: 'umhverfismal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/umhverfismal.svg'
  },
  {
    name: 'Samgöngumál',
    url: 'samgongumal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/samgongumal.svg'
  },
  {
    name: 'Byggðarmál',
    url: 'byggdarmal',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/byggdamal.svg'
  }
];

export const parties = [
  {
    letter: 'A',
    url: 'bjort-framtid',
    name: 'Björt Framtíð',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/bjort-framtid.png'
  },
  {
    letter: 'B',
    url: 'framsoknarflokkurinn',
    name: 'Framsóknarflokkurinn',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/framsoknarflokkurinn.png'
  },
  {
    letter: 'D',
    url: 'sjalfstaedisflokkurinn',
    name: 'Sjálfstæðisflokkurinn',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/sjalfstaedisflokkurinn.png'
  },
  {
    letter: 'S',
    url: 'samfylkingin',
    name: 'Samfylkingin',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/samfylkingin.png'
  },
  {
    letter: 'V',
    url: 'vinstri-graen',
    name: 'Vinstri Græn',
    image:
      'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/vinstri-graen.png'
  },
  {
    letter: 'P',
    url: 'piratar',
    name: 'Píratar',
    image: 'https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/piratar.png'
  }
];

writeFile(
  '../src/lib/data/categories.json',
  JSON.stringify(categories, null, 0),
  console.log
);

writeFile(
  '../src/lib/data/parties.json',
  JSON.stringify(parties, null, 0),
  console.log
);

categories.forEach(async category => {
  let out = await Promise.all(
    parties.map(async party => {
      const key = `./${party.url}/${category.url}.md`;

      let data = '';
      try {
        data = await readFile(key);
        data = data.toString();
      } catch (e) {
        console.error('Could not load key', key, process.cwd());
      }
      console.log('got it', party, data);
      return {
        ...party,
        statement: data ? marked(data) : ''
      };
    })
  );

  fs.writeFile(
    `../src/lib/data/${category.url}.json`,
    JSON.stringify(out, null, 0),
    console.log
  );
});

parties.forEach(async party => {
  let out = await Promise.all(
    categories.map(async category => {
      const key = `./${party.url}/${category.url}.md`;

      let data = '';
      try {
        data = await readFile(key);
        data = data.toString();
      } catch (e) {
        console.error('Could not load key', key, process.cwd());
      }
      console.log('got it', party, data);
      return {
        category: category.url,
        statement: data ? marked(data) : ''
      };
    })
  );

  fs.writeFile(
    `../src/lib/data/${party.url}.json`,
    JSON.stringify(out, null, 0),
    console.log
  );
});

// export const category = categoryUrl => {
//   console.log('looking up', categoryUrl);
//
//   return parties.map(p => {
//     let party = { ...p };
//
//     const key = `./data/${party.url}/${categoryUrl}.md`;
//
//     try {
//       // party.statement = require(key);
//       import(key).then(d => console.log('GOT IT', d));
//     } catch (e) {
//       console.error('did not find data', e, key);
//     }
//
//     return p;
//   });
// };
