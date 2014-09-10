/*function setCSS(node, property, value) {
  $(node).css(property, value);
  return true;
}*/

function getAnimationValue(array, index) {
  var curr = array[index];
  return getCanonicalName(curr.name) + ' ' + curr.duration.match(/\d+ms{1}|\d+s{1}/g) + ' ' + curr.timingFunction + ' 0s infinite alternate';
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

module.exports = {
  getAnimationValue: getAnimationValue,
  getNextIndex: getNextIndex,
  getRandomIndex: getRandomIndex,
  getIndexFromCanonicalName: getIndexFromCanonicalName,
  getCanonicalName: getCanonicalName
};
