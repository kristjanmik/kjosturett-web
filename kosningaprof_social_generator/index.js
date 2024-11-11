var gm = require('gm');
require('gm-base64');
const path = require('path');

const partiesImport = require('./parties');

exports.handler = (event, context, callback) => {
  let payload = decodeURIComponent(event.queryStringParameters.r);
  let type = decodeURIComponent(event.queryStringParameters.t);
  const IS_VISIR = type === 'v';
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

  parties = parties.slice(0, 3);

  let image = gm()
    .in('-page', '+0+0')
    .in(IS_VISIR ? './visir.jpg' : './prof.png')
    .fontSize(52)
    .fill('#000000')
    .font(path.join(__dirname, './Roboto-Bold.ttf'));

  parties.forEach((party, index) => {
    let pos = [0, 0];
    if (index === 0) {
      pos = [250, 180];
    } else if (index === 1) {
      pos = [600, 180];
    } else if (index === 2) {
      pos = [950, 180];
    }

    image
      .in('-page', '+' + pos[0] + '+' + pos[1])
      .in('./party-icons/' + party.slug + '.png')
      .drawText(pos[0] + 112, pos[1] + 356, party.score + '%');
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
    { queryStringParameters: { r: 'B:68|S:67|M:58|M:38|P:34|B:10' } },
    {},
    console.log
  );
}
