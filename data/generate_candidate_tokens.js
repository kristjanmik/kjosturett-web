const fs = require('fs');
const uuid = require('uuid');
const data = require('./candidates-kosning/candidates.json');

const Redis = require('ioredis');

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(
    process.env.REDIS_URL,
    process.env.REDIS_URL.includes('rediss://')
      ? {
          tls: {
            rejectUnauthorized: false
          }
        }
      : {}
  );
}

(() => {
  const tokenMap = {};
  for (let constituency in data) {
    for (let party in data[constituency]) {
      data[constituency][party].forEach(candidate => {
        const ssn = candidate.ssn;
        if (ssn.length !== 10) return;
        tokenMap[ssn] = uuid.v4();
        redis.set(`candidate-secret:${ssn}`, tokenMap[ssn]);
      });
    }
  }

  fs.writeFile(
    `./candidate-answer-map.json`,
    JSON.stringify(tokenMap, null, 1),
    error => {
      if (error) return console.error(error);
    }
  );

  console.log('done');
})();
