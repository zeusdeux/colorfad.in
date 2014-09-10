var $ = require('jquery');
var utils = require('./utils');
var animations = require('../data/animations.json');

var $canvas = $('.canvas');
var $main = $('.main-container');

var currIndex = utils.getRandomIndex(animations);
//var maxEmptySpans = 12;

//all animation switches happen based on hash in the url
//this big boy handles it all
$(window).on('hashchange', function() {
  currIndex = utils.getIndexFromCanonicalName(window.location.hash.slice(1), animations);
  currIndex = currIndex < 0 ? utils.getRandomIndex(animations) : currIndex;
  setAnimationVal();
  setAnimationText();
  setInfo();
});

$main.on('click', '.arrow-right', function() {
  currIndex = (++currIndex) % animations.length;
  setHash();
});
$main.on('click', '.arrow-left', function() {
  currIndex = (--currIndex) % animations.length;
  currIndex = currIndex < 0 ? animations.length - 1 : currIndex;
  setHash();
});

//proxy left and right arrow presses to prev and next buttons respectively
$('body').on('keydown', function(e) {
  if (e.keyCode === 37) $('.arrow-left').click();
  if (e.keyCode === 39) $('.arrow-right').click();
});

if (window.location.hash && window.location.hash !== '') $(window).trigger('hashchange');
else setHash();

function setHash() {
  window.location.hash = utils.getCanonicalName(animations[currIndex].name);
}

function setAnimationVal() {
  return $canvas.css('animation', utils.getAnimationValue(animations, currIndex));
}

function setAnimationText() {
  $('.text').text(animations[currIndex].text);
}

function setInfo(){
  var curr = animations[currIndex];
  var animName = curr.name;
  var colors = curr.colors;
  var spansCollection = $('.hexcode');

  $('.info .animation-name').text(animName);
  spansCollection.each(function(){
    $(this).attr('hidden', 'hidden');
  });
  colors.forEach(function(v, i){
    var $span = $(spansCollection[i]);
    $span.text(v);
    $span.removeAttr('hidden');
  });
}