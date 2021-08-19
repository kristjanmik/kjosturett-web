# Kjósturétt.is / Vote Correctly - A one-stop for Parliament elections in Iceland

_Citizens have the right to non-biased information to cast an informed vote. We, the people of Iceland, built this project to solve this problem for local elections._

### The process

Each party is given the same list of questions where they can fill out as pleased within a word count limit. This ensures that all parties are represented equally. Responses are then compiled and listed on our platform. KJósturétt builds on a trusted and proven track record since 2013 and holds integrity and transparency above all.

## Technical information

The master branch is currently being worked on in time for the 2021 parliamentary elections. Refer to other branches for snapshots of older elections.

### manual build

```bash
npm install
npm run build-data
```

**Node v8 or higher is needed to run the data build step**
You can then start the server at port 3000

```bash
npm start
```

### docker-compose

Automatically build and run the app on port 3000

```bash
docker-compose up
```

## Information on our Datasets

We have some relations in the dataset that have to be linked together. These relations complicate the project a bit but give us the benefit of having all the repo data in an easily readable and flat format. All data lives in the data folder. To build the dataset run ./build.sh inside the /data folder. All the output goes to /data/build folder. **Some data needs to be built separately.** We state this where needed.

Are you having trouble building the data? Check out the data/build_dump-22-10-17-09-58.zip for an older archive that can be unzipped into data/build, and the project should run just fine.

## Data sources

We have various data sources. Described below are data sources that are available after the build step, but the raw data is also available in /build

### Thingmenn.is

[Thingmenn.is](http://thingmenn.is) is a great project where you can see all the discussion by people in Alþingi, ranked by how they vote.

### Where do I vote?

You can query the kjorskra endpoint at https://kjorskra.kjosturett.is/leita/{{VALID-KENNITALA}}. This endpoint can take up to 2-4 seconds to load since we are using a very slow screen scraper. The second request to this endpoint with the same kennitala is cached heavily for one month. _If .success is false, the kennitala is most likely invalid_

```json
{
  "success": true,
  "kennitala": "1234567890",
  "nafn": "Jón Jónsson",
  "logheimili": "Melbær 14",
  "kjordaemi": "Reykjavíkurkjördæmi suður",
  "sveitafelag": "Reykjavík",
  "kjorstadur": "Árbæjarskóli",
  "kjordeild": "1"
}
```

### /data/build/{{party}}.json

A file that lists all catagories and their statement for a party. _Likely to change to include party-specific data as well_

```json
[
  {
    "category": "atvinnumal",
    "name": "Atvinnumál",
    "statement": "<p>Alþýðufylkingin hafnar framsali á samningsrétti einstakra verkalýðsfélaga...</p>\n"
  },
  {}
]
```

### /data/build/{{category}}.json

```json
[
  {
    "letter": "A",
    "url": "bjort-framtid",
    "name": "Björt Framtíð",
    "nameDeflected": "Bjartrar Framtíðar",
    "website": "http://www.bjortframtid.is",
    "leader": "Óttarr Proppé",
    "leaderTitle": "Formaður",
    "statement": "<p>Björt framtíð hefur þegar beitt sér fyrir setningu fjárfestingaáætlunar...</p>"
  },
  {}
]
```

### /data/build/candidates.json

First 6 people from every party in every region

```json
[
  {
    "saeti": 1,
    "nafn": "Erna Lína Örnudóttir Baldvinsdóttir",
    "kjordaemi": "sudvestur",
    "slug": "erna-lina-ornudottir-baldvinsdottir",
    "bokstafur": "R",
    "svar": "112541123451234512345123451234"
  },
  {}
]
```

See _How does the reply string work?_ for .svar clarification.

### /data/build/categories.json

All categories, aka málefnaflokkar(should be topics, but we are just too deep :P)

```json
[
  {
    "name": "Atvinnumál",
    "url": "atvinnumal"
  },
  {}
]
```

### /data/build/parties.json

```json
[
  {
    "letter": "A",
    "url": "bjort-framtid",
    "name": "Björt Framtíð",
    "nameDeflected": "Bjartrar Framtíðar",
    "website": "http://www.bjortframtid.is",
    "leader": "Óttarr Proppé",
    "leaderTitle": "Formaður"
  },
  {}
]
```

### /data/build/replies-candidates.json

```json
[
  {
    "n": "Alþýðufylkingin",
    "r": "112541123451234512345123451234"
  },
  {}
]
```

.n represents the name where .r represents the reply.

### /data/build/replies-parties.json

```json
[
  {
    "n": "Alþýðufylkingin",
    "r": "112541123451234512345123451234"
  },
  {}
]
```

.n represents the name where .r represents the reply.

### How does the reply string work?

When a person answers all the questions, we generate a numerical sequence. Each number represents one question. You can think of this zero to one scale as 0 being extremely against(mjög á móti) and 1 being (mjög sammála). 0.5 is a neutral response. This is the format of each number in the sequence.

- 1 stands for very much against, with the value of _0_
- 2 stands for somewhat against, with a value of _0.25_
- 3 stands for neutral, with a value of _0.5_
- 4 stands for somewhat agree, with a value of _0.75_
- 5 stands for very much agree, with value of _1_
- 6 stands for no response
