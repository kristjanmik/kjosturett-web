import fs from 'fs';
const { promisify } = require('util');
import marked from 'marked';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const categories = [
  {
    name: 'Atvinnumál',
    url: 'atvinnumal'
  },
  {
    name: 'Byggðarmál',
    url: 'byggdarmal'
  },
  {
    name: 'Evrópumál',
    url: 'evropumal'
  },
  {
    name: 'Heilbrigðismál',
    url: 'heilbrigdismal'
  },
  {
    name: 'Húsnæðismál',
    url: 'husnaedismal'
  },
  {
    name: 'Jafnréttismál',
    url: 'jafnrettismal'
  },
  {
    name: 'Menntamál',
    url: 'menntamal'
  },
  {
    name: 'Samgöngumál',
    url: 'samgongumal'
  },
  {
    name: 'Sjávarútvegsmál',
    url: 'sjavarutvegsmal'
  },
  {
    name: 'Skattamál',
    url: 'skattamal'
  },
  {
    name: 'Stjórnarskrármál',
    url: 'stjornarskrarmal'
  },
  {
    name: 'Umhverfismál',
    url: 'umhverfismal'
  },
  {
    name: 'Velferðarmál',
    url: 'velferdarmal'
  }
];

export const parties = [
  {
    letter: 'A',
    url: 'bjort-framtid',
    name: 'Björt Framtíð',
    nameDeflected: 'Bjartrar Framtíðar',
    website: 'http://www.bjortframtid.is',
    leader: 'Óttarr Proppé',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'B',
    url: 'framsoknarflokkurinn',
    name: 'Framsóknarflokkurinn',
    nameDeflected: 'Framsónarflokksins',
    website: 'https://framsokn.is',
    leader: 'Sigurður Ingi Jóhannsson',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'C',
    url: 'vidreisn',
    name: 'Viðreisn',
    nameDeflected: 'Viðreisnar',
    website: 'https://www.vidreisn.is',
    leader: 'Þorgerður Katrín Gunnarsdóttir',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'D',
    url: 'sjalfstaedisflokkurinn',
    name: 'Sjálfstæðisflokkurinn',
    nameDeflected: 'Sjálfstæðisflokksins',
    website: 'http://xd.is',
    leader: 'Bjarni Benediktsson',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'F',
    url: 'flokkur-folksins',
    name: 'Flokkur Fólksins',
    nameDeflected: 'Flokks Fólksins',
    website: 'https://www.flokkurfolksins.is',
    leader: 'Inga Sæland',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'M',
    url: 'midflokkurinn',
    name: 'Miðflokkurinn',
    nameDeflected: 'Miðflokksins',
    website: 'http://midflokkurinn.is',
    leader: 'Sigmundur Davíð Gunnlaugsson',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'P',
    url: 'piratar',
    name: 'Píratar',
    nameDeflected: 'Pírata',
    website: 'https://piratar.is',
    leader: 'Þór­hild­ur Sunna Ævars­dótt­ir',
    leaderTitle: ''
  },
  {
    letter: 'R',
    url: 'althydufylkingin',
    name: 'Alþýðufylkingin',
    nameDeflected: 'Alþýðufylkingarinnar',
    website: 'https://www.althydufylkingin.is/',
    leader: 'Þorvaldur Þorvaldsson',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'S',
    url: 'samfylkingin',
    name: 'Samfylkingin',
    nameDeflected: 'Samfylkingarinnar',
    website: 'https://xs.is',
    leader: 'Logi Einarsson',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'T',
    url: 'dogun',
    name: 'Dögun',
    nameDeflected: 'Dögunar',
    website: 'http://xdogun.is/',
    leader: 'Pálmey Gísladóttir',
    leaderTitle: 'Formaður'
  },
  {
    letter: 'V',
    url: 'vinstri-graen',
    name: 'Vinstri Græn',
    nameDeflected: 'Vinstri Grænna',
    website: 'https://vg.is',
    leader: 'Katrín Jakobsdóttir',
    leaderTitle: 'Formaður'
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
        name: category.name,
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
