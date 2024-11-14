const Redis = require('ioredis');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const { decodeAnswersToken } = require('../src/utils');

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(
    process.env.REDIS_URL,
    process.env.REDIS_URL.includes('rediss://')
      ? {
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {}
  );
}

(async () => {
  const keys = await redis.keys('poll:public:*');
  let values = [];

  if (keys.length > 0) {
    values = await redis.mget(keys);
  }

  const out = [];

  keys.forEach((key, index) => {
    const split = key.split(':');
    const token = split[2];

    if (values[index]) {
      reply = (decodeAnswersToken(values[index]) || []).join(',');
      out.push(reply);
    }
  });

  await writeFile('./poll/replies-2024.json', JSON.stringify(out, null, 0));
  console.log('done');
  process.exit(0);
})();
