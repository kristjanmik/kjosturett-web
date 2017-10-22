const candidates = require('./build/candidates.json');
const rawData = require('./ruv2016/replies.json');

let candidatesObj = {};

const questionMapper = [
  '5734308989894656',
  '5093958893961216',
  '6411006857183232',
  '5190321585520640',
  '6458664351170560',
  '4938708174241792',
  '4579450668711936',
  '5621904058613760',
  '4963486645878784',
  '6037413690343424',
  '6147325124673536',
  '5283032212701184',
  '4885660764733440',
  '4939151898050560',
  '6111974591037440',
  '5429584549904384',
  '5350620636643328',
  '6686258157846528',
  '4918273256718336',
  '5086029579026432',
  '6347201359904768',
  '4696738843590656',
  '6574361106448384',
  '5890387027689472',
  '6684883499876352',
  '5275022367129600',
  '6416588905381888',
  '4721193850503168',
  '5096974229438464',
  '5702887546028032'
];

candidates.forEach(candidate => {
  candidatesObj[candidate.nafn] = candidate;
});

const options = [0, 0.25, 0.5, 0.75, 1];

const currentCandidates = rawData.children
  .filter(row => {
    const obj = candidatesObj[row.title];

    if (!obj) return false;

    return true;
  })
  .map(row => {
    const reply = questionMapper
      .map(question => {
        let value = row.values[question];
        if (typeof value === 'undefined') return 6;

        value = value / 100.0;

        let response = 6; //No reply
        let minDistance = 1;

        options.forEach((option, index) => {
          const d = Math.abs(option - value);
          if (d < minDistance) {
            response = index + 1;
            minDistance = d;
          }
        });

        return response;
      })
      .join('');

    const candidate = candidatesObj[row.title];

    let out = {
      ...candidate
    };

    if (reply === '666666666666666666666666666666') {
      return {
        ...out,
        reply: null
      };
    }

    return {
      ...out,
      reply
    };
  })
  .filter(row => row.reply);

console.log('data', JSON.stringify(currentCandidates, null, 1));
