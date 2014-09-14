var util      = require('util');
var moreUtils = require('./utils');
var Transform = require('stream').Transform;

util.inherits(ToCss, Transform);

function ToCss(opts) {
  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

ToCss.prototype._transform = function(chunk, enc, cb) {
  var self = this;
  moreUtils.getCSS(chunk, function(err, val){
    if (err) cb(err);
    self.push(val);
    cb();
  });
};

module.exports = ToCss;
