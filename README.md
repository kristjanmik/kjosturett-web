# We are having a hackathon on the 22nd of October: [https://www.facebook.com/events/1493507597370764/](https://www.facebook.com/events/1493507597370764/)

##Getting started

```bash
npm install
npm run build-data
```

**Node v8 or higher is needed to run the data build step**
You can then start the server at port 3000

```bash
npm start
```

## Why do we build the data?
We have some relations in the dataset that have to be hooked. This complicates the process but gives us the huge benefit of having all the data here in the repo, easily readable and flat. All data lives in the data folder. To build the data run ./build.sh inside that folder(**nodejs v8 required**). All the output goes to /data/build folder. **Some data needs to be built seperately.** We state this where needed.

Having trouble building the data? Check out the data/build-dump folder for archives. You can unzip the most recent folder into data/build and the project should run just fine

## How does the reply string work?
When a person answers all the questions we generate a numerical sequence. Each number represent one question. You can think of this zero to one scale as 0 being extremely against(mjög á móti) and 1 being (mjög sammála). 0.5 is a neautral response.This is the format of each number in the sequence.
- 1 stands for first option, with value of *0*
- 2 stands for first option, with value of *0.25*
- 3 stands for first option, with value of *0.5*
- 4 stands for first option, with value of *0.75*
- 5 stands for first option, with value of *1*
- 6 stands for no response

## Data sources
We have various data sources. Described below are data sources that are available after the build step, but the raw data is also available in /build

### Where do I vote?
You can query the kjorskra endpoint at: https://kjorskra.kjosturett.is/leita/{{VALID-KENNITALA}}. This endpoint can take up to 2-4 seconds to load since we are using a very slow screenscraper. Second request to this endpoint with the same kennitala is cached heavily for 1 month. *If .success is false, the kennitala is most likely invalid*

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
Lists all categories for a party. *Likely to change to include party specific data as well*

```json
[{
	"category": "atvinnumal",
	"name": "Atvinnumál",
	"statement": "<p>Alþýðufylkingin hafnar framsali á samningsrétti einstakra verkalýðsfélaga...</p>\n"
},{}]
```


### /data/build/{{category}}.json
```json
[{
	"letter": "A",
	"url": "bjort-framtid",
	"name": "Björt Framtíð",
	"nameDeflected": "Bjartrar Framtíðar",
	"website": "http://www.bjortframtid.is",
	"leader": "Óttarr Proppé",
	"leaderTitle": "Formaður",
	"statement": "<p>Björt framtíð hefur þegar beitt sér fyrir setningu fjárfestingaáætlunar...</p>"
},{}]
```

### /data/build/candidates.json
First 6 people from every party in every region

```json
[{
	"saeti": 1,
	"nafn": "Erna Lína Örnudóttir Baldvinsdóttir",
	"kjordaemi": "sudvestur",
	"slug": "erna-lina-ornudottir-baldvinsdottir",
	"bokstafur": "R",
	"svar": "112541123451234512345123451234"
},{}]
```

See *How does the reply string work?* for .svar clarification

### /data/build/categories.json
All categories, aka málefnaflokkar(should be topics but we are just to deep :P)

```json
[{
  "name":"Atvinnumál",
  "url":"atvinnumal"
},{}]
```

### /data/build/parties.json
```json
[{
	"letter": "A",
	"url": "bjort-framtid",
	"name": "Björt Framtíð",
	"nameDeflected": "Bjartrar Framtíðar",
	"website": "http://www.bjortframtid.is",
	"leader": "Óttarr Proppé",
	"leaderTitle": "Formaður"
},{}]
```

### /data/build/replies-candidates.json
```json
[{
  "n":"Alþýðufylkingin",
  "r":"112541123451234512345123451234"
},{}]
```
.n represents name where .r represents the reply.

### /data/build/replies-parties.json
```json
[{
  "n":"Alþýðufylkingin",
  "r":"112541123451234512345123451234"
},{}]
```
.n represents name where .r represents the reply.
