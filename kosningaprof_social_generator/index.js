var gm = require('gm');
require('gm-base64');
const path = require('path');

const partiesImport = require('./parties');

exports.handler = (event, context, callback) => {
  let payload = decodeURIComponent(event.queryStringParameters.r);
  // let payload = 'C:68|D:67|F:58|M:38|P:34';

  let parties = payload.split('|').map(raw => {
    const [letter, score] = raw.split(':');

    let finalScore = 0;

    try {
      finalScore = parseInt(score, 10);
    } catch (e) {
      console.error(e);
    }

    return {
      letter,
      slug: partiesImport[letter],
      score: finalScore,
    };
  });

  parties.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  parties = parties.slice(0, 5);

  let image = gm()
    .in('-page', '+0+0')
    .in('./prof.png')
    .fontSize(44)
    .fill('#000000')
    .font(path.join(__dirname, './Roboto-Bold.ttf'));

  parties.forEach((party, index) => {
    let pos = [0, 0];
    if (index === 0) {
      //Left pos
      pos = [680, 85];
    } else if (index === 1) {
      //Left pos
      pos = [900, 85];
    } else if (index === 2) {
      pos = [590, 342];
    } else if (index === 3) {
      pos = [800, 342];
    } else if (index === 4) {
      pos = [1000, 342];
    }

    image
      .in('-page', '+' + pos[0] + '+' + pos[1])
      .in('./party-icons/' + party.slug + '.png')
      .drawText(pos[0] + 55, pos[1] + 225, party.score + '%');
  });

  if (process.env.NODE_ENV === 'development') {
    image.mosaic().write('./out.png', function(err) {
      if (err) console.error(err);
      if (!err) console.log('Wrote to out.png');
    });
  }

  if (process.env.NODE_ENV !== 'development') {
    image.mosaic().toBase64('png', function(error, base64) {
      if (error) return callback(error);
      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
        },
        body: base64,
        isBase64Encoded: true,
      });
    });
  }
};

if (process.env.NODE_ENV === 'development') {
  exports.handler(
    { queryStringParameters: { r: 'J:68|D:67|F:58|M:38|P:34' } },
    {},
    console.log
  );
}
