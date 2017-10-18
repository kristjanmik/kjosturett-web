const globby = require('globby');

globby(['../parties/**/velferdarmal.md']).then(paths => {
  console.log(paths);
  //=> ['unicorn', 'rainbow']
});
