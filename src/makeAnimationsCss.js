var fs           = require('fs');
var path         = require('path');
var ToCss        = require('./ToCss');
var JSONStream   = require('JSONStream');
var jsonParser   = JSONStream.parse([true]);
var animationsRS = fs.createReadStream(path.resolve('data/animations.json'), {
  encoding: 'utf-8'
});
var animationsWS = fs.createWriteStream(path.resolve('public/css/animations.css'), {
  encoding: 'utf-8'
});

animationsRS.pipe(jsonParser).pipe(new ToCss).pipe(animationsWS);
