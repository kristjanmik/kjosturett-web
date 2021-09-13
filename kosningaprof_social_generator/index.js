var gm = require('gm').subClass({ imageMagick: true });
require('gm-base64');

const partiesImport = require('./parties');

exports.handler = (event, context, callback) => {
  let payload = decodeURIComponent(event.pathParameters.text);

  let parties = payload.split('|').map(raw => {
    const [letter, score] = raw.split(':');
    return {
      letter,
      slug: partiesImport[letter],
      score
    };
  });

  parties.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  parties = parties.slice(0, 5);

  const image = gm()
    .in('-page', '+0+0')
    .in('./prof.png');

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
      .font('./Roboto-Bold.ttf')
      .fontSize(44)
      .drawText(pos[0] + 55, pos[1] + 225, party.score + '%');
  });

  image
    .mosaic()
    // .write('./out.png', function(err) {
    //   if (!err) console.log('done');
    // });
    .toBase64('png', function(error, base64) {
      if (error) return callback(error);
      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png'
        },
        body: base64,
        isBase64Encoded: true
      });
    });
};

exports.handler(
  { pathParameters: { text: 'J:68|D:67|F:58|M:38|P:34' } },
  {},
  console.log
);
