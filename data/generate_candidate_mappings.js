const fs = require('fs');
const uuid = require('uuid');
const { promisify } = require('util');
const data = require('./candidates-kosning/candidates.json');
const statFile = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

const Redis = require('ioredis');

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

const candidateSecretFile = './.candidate-secret.json';
const candidatePublicFile = './data/candidate-public.json';
(async () => {
  let hasSecretFile = false;
  let hasPublicFile = false;

  try {
    hasSecretFile = (await statFile(candidateSecretFile)).isFile();
    hasPublicFile = (await statFile(candidatePublicFile)).isFile();
  } catch (e) {}

  if (hasSecretFile || hasPublicFile)
    throw new Error(
      'Not proceeding as the script would overwrite current secret and or public map'
    );

  const secretMap = {};
  const publicMap = {};
  const promiseChain = [];
  for (let constituency in data) {
    for (let party in data[constituency]) {
      data[constituency][party].forEach(candidate => {
        const ssn = candidate.ssn;
        if (ssn.length !== 10) return;
        secretMap[ssn] = uuid.v4();
        publicMap[ssn] = uuid.v4();
        promiseChain.push(redis.set(`candidate-secret:${ssn}`, secretMap[ssn]));
        promiseChain.push(redis.set(`candidate-token:${secretMap[ssn]}`, ssn));
      });
    }
  }

  await Promise.all(promiseChain);

  await writeFile(
    candidatePublicFile,
    JSON.stringify(publicMap, null, 0),
    error => {
      if (error) return console.error(error);
    }
  );

  await writeFile(
    candidateSecretFile,
    JSON.stringify(secretMap, null, 0),
    error => {
      if (error) return console.error(error);
    }
  );

  console.log('done');
  process.exit(0);
})();
