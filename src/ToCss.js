var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(ToCss, Transform);

function ToCss(opts) {
  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

ToCss.prototype._transform = function(chunk, enc, cb) {
  var data;
  var vendorPrefixAnimsArray;
  var vendorPrefix = ['-webkit-', ''];
  try {
    data = chunk;
    if (typeof data === 'undefined' || data === '' || data === null) {
      this.push(null);
      cb();
    }
    vendorPrefixAnimsArray = vendorPrefix.map(function(v) {
      var diff = ~~ (100 / (data.colors.length - 1));
      var init = 0;
      var rules;
      // if there's only one color, push the same on again
      // so that we have it twice in the array (for 0% and 100%)
      if (data.colors.length === 1) data.colors.push(data.colors[0]);
      rules = data.colors.map(function(c, i, a) {
        var rule;
        //if init > 100 or if its the last element then make init 100
        //this is so that all animations have a 100% rule
        init = init > 100 || i === a.length - 1 ? 100 : init;
        rule = '  ' + init + '% {\n';
        rule += '    background: ' + c + ';\n';
        rule += '  }';
        console.log(a.length-1, i, init, c);
        init += diff;
        return rule;
      });
      rules = rules.join('\n');
      return '@' + v + 'keyframes' + ' ' + data.name.replace(/[\W]/g, '') + ' {\n' + rules + '\n}\n';
    });
    vendorPrefixAnimsArray = vendorPrefixAnimsArray.join('\n');
    this.push(vendorPrefixAnimsArray);
    cb();
  }
  catch (e) {
    cb(e);
  }
};

module.exports = ToCss;
