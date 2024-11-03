const cheerio = require('cheerio');
const { clean, isPerson } = require('kennitala');
const request = require('request');
const bluebird = require('bluebird');
const requestAsync = bluebird.promisify(request);
const fields = [
  'kennitala',
  'nafn',
  'logheimili',
  'kjordaemi',
  'sveitafelag',
  'kjorstadur',
  'kjordeild',
];

module.exports = async function(kt) {
  if (!isPerson(kt)) {
    return {
      success: false,
      message: `Kennitala not valid: ${kt}`,
    };
  }

  // Ensure hyphen is in the right place
  const kt_cleaned = clean(kt);

  const response = await requestAsync({
    url:
      'https://svc.skra.is/hvarkyseg/Kosning/1000106/HvarKysEg/' + kt_cleaned,
    method: 'GET',
  });

  let data = {};

  try {
    data = JSON.parse(response.body);
    data.kjordaemi = data.sveitarfelag;
    data.success = true;
  } catch (e) {
    console.error(response.body);
  }

  console.log(data);

  if (!data.kennitala)
    return {
      success: false,
      message: 'Kennitala not found',
    };
  else return data;
};

if (!module.parent) {
  if (!process.argv[2]) console.log('CLI usage: node kjorskra [kennitala]');
  // else module.exports(process.argv[2]).then(console.log, console.log);
}
