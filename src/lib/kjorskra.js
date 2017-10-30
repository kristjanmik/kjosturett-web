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
  'kjordeild'
];

module.exports = async function(kt) {
  if (!isPerson(kt)) {
    return {
      success: false,
      message: 'Kennitala not valid'
    };
  }

  let res, $;
  let form = {};

  // Ensure hyphen is in the right place
  const kt_cleaned = clean(kt);
  const kt_formatted = kt_cleaned.slice(0, 6) + '-' + kt_cleaned.slice(6);

  res = await requestAsync({
    url: 'https://kjorskra.skra.is/kjorskra/',
    method: 'GET',
    gzip: true
  });
  $ = cheerio.load(res.body);
  $('form input').each((i, v) => {
    form[$(v).attr('name')] = $(v).attr('value');
  });

  form.txtKennitala_Raw = kt_formatted;
  form.txtKennitala = kt_formatted;
  form.ASPxGridView1$DXKVInput = kt_cleaned;

  res = await requestAsync({
    url: 'https://kjorskra.skra.is/kjorskra/',
    method: 'POST',
    gzip: true,
    form
  });

  $ = cheerio.load(res.body);

  const response = $('#ASPxGridView1_DXDataRow0 td')
    .map((i, v) => $(v).text())
    .toArray()
    .reduce(
      (p, d, i) => {
        p[fields[i]] = d.trim();
        return p;
      },
      {
        success: true
      }
    );

  if (!response.kennitala)
    return {
      success: false,
      message: 'Kennitala not found'
    };
  else return response;
};

if (!module.parent) {
  if (!process.argv[2]) console.log('CLI usage: node kjorskra [kennitala]');
  else module.exports(process.argv[2]).then(console.log, console.log);
}
