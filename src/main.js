var $ = require('jquery');
var utils = require('./utils');
var ZC = require('zeroclipboard');
var animations = require('../data/animations.json');

var $canvas = $('.canvas');
var $body = $('body');

ZC.config({
  swfPath: 'node_modules/zeroclipboard/dist/ZeroClipboard.swf'
});

var currIndex = utils.getRandomIndex(animations);
var copyLinkButtonClient = new ZC($('.copy-link-button'));

//all animation switches happen based on hash in the url
//this big boy handles it all
$(window).on('hashchange', function() {
  currIndex = utils.getIndexFromCanonicalName(window.location.hash.slice(1), animations);
  currIndex = currIndex < 0 ? utils.getRandomIndex(animations) : currIndex;
  setAnimationVal();
  setAnimationText();
  setInfo();
});

$body.on('click', '.arrow-right', function() {
  currIndex = (++currIndex) % animations.length;
  setHash();
});
$body.on('click', '.arrow-left', function() {
  currIndex = (--currIndex) % animations.length;
  currIndex = currIndex < 0 ? animations.length - 1 : currIndex;
  setHash();
});
$body.on('click', '.cross', function() {
  triggerEsc($body);
});
$body.on('click', '.help-button', function() {
  triggerEsc($body);
  $body.addClass('modal-active');
  $('.help-modal.scale').addClass('show');
});
$body.on('click', '.contrib-button', function() {
  triggerEsc($body);
  $body.addClass('modal-active');
  $('.contrib-modal.scale').addClass('show');
});
$body.on('click', '.share-button', function() {
  triggerEsc($body);
  $body.addClass('modal-active');
  $('.share-modal.scale').addClass('show');
});

copyLinkButtonClient.on('ready', function(event) {
  copyLinkButtonClient.on('copy', function(event) {
    var copyBtn = $('.copy-link-button');
    var text = copyBtn.text();
    copyLinkButtonClient.setText(window.location.href);
    copyBtn.text('Copied!');
    window.setTimeout(function() {
      copyBtn.text(text);
    }, 1000);
  });
  copyLinkButtonClient.on('aftercopy', function(event) {
    console.log('Copied text to clipboard: ' + event.data['text/plain']);
  });
});

//proxy left and right arrow presses to prev and next buttons respectively
$body.on('keydown', function(e) {
  //left arrow
  if (e.keyCode === 37) $('.arrow-left').click();
  //right arrow
  if (e.keyCode === 39) $('.arrow-right').click();
  //esc
  if (e.keyCode === 27) {
    $body.removeClass('modal-active');
    $('.show').removeClass('show');
  }
  //question mark and fwd slash (really only fwd slash)
  if (e.keyCode === 191) {
    $('.help-button').click();
  }
  //'c' -> contribute modal toggle
  if (e.keyCode === 67) {
    $('.contrib-button').click();
  }
  //'s' -> share modal toggle
  if (e.keyCode === 83) {
    $('.share-button').click();
  }
});

if (window.location.hash && window.location.hash !== '') $(window).trigger('hashchange');
else setHash();


function triggerEsc($el) {
  var e = $.Event('keydown', {
    keyCode: 27,
    which: 27
  });
  e.which = 27;
  $el.trigger(e);
}

function setHash() {
  window.location.hash = utils.getCanonicalName(animations[currIndex].name);
}

function setAnimationVal() {
  return $canvas.css('animation', utils.getAnimationValue(animations, currIndex));
}

function setAnimationText() {
  $('.text').text(animations[currIndex].text);
}

function setInfo() {
  var curr = animations[currIndex];
  var animName = curr.name;
  var colors = curr.colors;
  var spansCollection = $('.hexcode');

  $('.info .animation-name').text(animName);
  spansCollection.each(function() {
    $(this).attr('hidden', 'hidden');
  });
  colors.forEach(function(v, i) {
    var $span = $(spansCollection[i]);
    $span.text(v.toUpperCase());
    $span.removeAttr('hidden');
  });
}

window.$ = $;
