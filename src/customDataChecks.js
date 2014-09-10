var animations = require('../data/animations');
var validators = {
  length: function(arr, name) {
    if (arr.length > 12) throw new Error('Only a maximum of 12 colors are allowed currently. Check animation called ' + name);
  },
  duration: function(str, name) {
    var temp = str;
    str = str.match(/\d+ms{1}|\d+s{1}/g);
    if (!str || !str.length) throw new Error('Invalid duration ' + temp + ' in animation ' + name);
  },
  uniq: function(arr) {
    arr.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name === b.name) return 0;
      return 1;
    });
    arr.reduce(function(p, c) {
      if (p.name === c.name) throw new Error('Unique check failed. More than one occurence of ' + p.name);
      else return c;
    });
  }
};

animations.forEach(function(v) {
  validators.length(v.colors, v.name);
  validators.duration(v.duration, v.name);
});
validators.uniq(animations);
process.exit(0);
