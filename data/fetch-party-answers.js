const Redis = require('ioredis');
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const writeFile = promisify(fs.writeFile);

const partyMap = require('./party-answer-map.json');

let redis;

const reversePartyMap = Object.assign(
  {},
  ...Object.entries(partyMap).map(([a, b]) => ({ [b]: a }))
);
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    tls: {
      rejectUnauthorized: false
    }
  });
}

function tokenToParty(token) {
  return reversePartyMap[token];
}

(async () => {
  console.log('Fetch:Party Answers - Building');

  const keys = await redis.keys('poll:private:*');
  let values = [];

  if (keys.length > 0) {
    values = await redis.mget(keys);
  }

  const out = {};

  keys.forEach((key, index) => {
    const split = key.split(':');
    const token = tokenToParty(split[2]);
    const timestamp = split[3];
    const reply = values[index];

    if (!out[token] || out[token].timestamp < timestamp) {
      out[token] = {
        timestamp,
        reply
      };
    }
  });

  const paths = await globby(['./parties/**/data.json']);

  console.log('out', out);
  paths.forEach(async path => {
    const data = require(path);
    if (out[data.url]) {
      data.reply = out[data.url].reply || '';
    } else {
      data.reply = '';
    }
    await writeFile(path, JSON.stringify(data, null, 2));
  });

  console.log('Fetch:Party Answers - Done');
})();
