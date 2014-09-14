/*function setCSS(node, property, value) {
  $(node).css(property, value);
  return true;
}*/

function getAnimationValue(array, index) {
  var curr = array[index];
  var duration = curr.duration.match(/\d+ms{1}|\d+s{1}/g);
  var defaultDuration = '10s';
  return getCanonicalName(curr.name) + ' ' + (duration.length ? duration[0] : defaultDuration) + ' ' + curr.timingFunction + ' 0s infinite alternate';
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * 100) % array.length;
}

function getNextIndex(array, currentIndex) {
  return (++currentIndex) % array.length;
}

function getIndexFromCanonicalName(name, array) {
  return array.reduce(function(p, c, i, a) {
    if (name === getCanonicalName(c.name)) return i;
    else return p;
  }, -1);
}

function getCanonicalName(name) {
  return name.replace(/[\W]/g, '');
}

//this is used by ToCss transform stream
//and browserside code
//It returns a keyframe declaration based on
//object passed to it
//Object must be of the form found in animations.json
function getCSS(object, cb){
  var data = object;
  var vendorPrefixAnimsArray;
  var vendorPrefix = ['-webkit-', ''];
  try {
    if (typeof data === 'undefined' || data === '' || data === null) {
      cb(null, null);
    }
    vendorPrefixAnimsArray = vendorPrefix.map(function(v) {
      var diff = ~~ (100 / (data.colors.length - 1));
      var init = 0;
      var rules;

      console.log('@' + v + 'keyframes' + ' ' + getCanonicalName(data.name));
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
        console.log(a.length - 1, i, init, c);
        init += diff;
        return rule;
      });
      rules = rules.join('\n');
      return '@' + v + 'keyframes' + ' ' + getCanonicalName(data.name) + ' {\n' + rules + '\n}\n';
    });
    vendorPrefixAnimsArray = vendorPrefixAnimsArray.join('\n');
    cb(null, vendorPrefixAnimsArray);
  }
  catch (e) {
    cb(e);
  }
}

module.exports = {
  getAnimationValue: getAnimationValue,
  getNextIndex: getNextIndex,
  getRandomIndex: getRandomIndex,
  getIndexFromCanonicalName: getIndexFromCanonicalName,
  getCanonicalName: getCanonicalName,
  getCSS: getCSS
};
