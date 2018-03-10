(function ($) {
  $.extend({
      playSound: function () {
          return $(
                 '<audio class="sound-player" autoplay="autoplay" style="display:none;">'
                   + '<source src="' + arguments[0] + '" />'
                   + '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>'
                 + '</audio>'
               ).appendTo('body');
      },
      stopSound: function () {
          $(".sound-player").remove();
      }
  });
})(jQuery);
var annamalai = null;
var $egg = $('#egg-all');
var $chicken = $('#chicken');
var $top = $('#top_part');
var $bottom = $('#bottom');
var $break = $('#break');
var $hint = $('.hint');
var $message = $('.message');

var SPACE_LIMIT = 100;

// Track if mouse or space is hit
var isAction = false;

// Track touch
var isTouching = false;

// Track crack progress when hiting the enter
var crackProgress = 0;

// Hide the crack
TweenLite.set($break, {drawSVG:"0"})

// Detect space press
$(window).keydown(function (e) {
  e.preventDefault()

  if (e.keyCode === 0 || e.keyCode === 32 && !isAction && crackProgress < 100) {
     breakEgg();
   }
}).keyup(function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
      isAction = false;
    }
});

window.addEventListener('touchstart', function onFirstTouch() {
  breakEgg();
}, false);

var test = -1;
var cracksounds = ['crack1.mp3', 'crack2.mp3', 'crack1.mp3'];
var paths = ['M89.467,194 117.5,200', 'M117.5,200 159.834,194 203.834,200', 'M203.834,200 230.019,194'];
var danceRoutine = 0;
function breakEgg() {
  // var num = randomNumber(30, 35);
    crackProgress += 35;
    test += 1;
    $.playSound(cracksounds[test]);
    dashAnimation($break, crackProgress);
    shake($egg);

    isAction = true;

    hideHint();

    console.log(test);

    // If crack progress is done
    if ( crackProgress >= SPACE_LIMIT ) {
      animateChickenIntro();
      annamalai = $.playSound('Annamalai.mp3');
      $(annamalai).on('ended', function() {
         window.open('logo-video.html');
         // enable button/link
      });
      var danceEgg = setInterval(function(){
        if(danceRoutine <= 12){
          shake($chicken);
          danceRoutine ++;
        }else{
          clearInterval(danceEgg);
        }
      }, 1500);
    }
}


// Function name -> ¯\_(ツ)_/¯
function animateChickenIntro() {

  $hint.fadeOut('slow');

  var t1 = new TimelineLite();

    t1.to($break, 0.1, { alpha: 0}, '-=0.3');
    t1.to($top, 0.4, { y: '-=60', rotationX: 15, ease: Back.easeOut.config(1.7)});
    t1.to($chicken, 0.3, { y: '-50', yoyo: true}, '-=0.4');
    t1.to($message, 0.4, { opacity: 1});
    t1.to($top, 0.6, { alpha: 0, delay: 0.5});

  // t1.start();
}

//dance path
function dance(path){
  TweenMax.to(path, 0.1, {rotationX: 10, x: '4%', yoyo:false, repeat:5});
  TweenMax.to(path, 0.1, {rotationX: -20, x: '-8%', yoyo:false, repeat:5});
}

// Shake path
function shake(path) {
  TweenMax.to(path, 0.1, {rotationX: 10, x: '1%', yoyo:true, repeat:5});
  TweenMax.to(path, 0.1, {rotationX: -10, x: '-1%', yoyo:true, repeat:5});


      // $("#egg-all #break").remove();
      var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
      newLine.setAttribute('id','break');
      newLine.setAttribute('fill','none');
      newLine.setAttribute('stroke','#72747C');
      newLine.setAttribute('stroke-miterlimit','10');
      newLine.setAttribute('d',paths[test]);
      $("#egg-all").append(newLine);
}

/*
* Animate path to provided value
* @param {number} offset
*/
function dashAnimation(path, value) {
  return TweenLite.to(path, 0.3, {drawSVG:"0 "+value+"%", ease: Power3.easeOut})
}

/*
* Generate random number in range.
* @param {number} Min value
* @param {number} Max value
* @returns {number}
*/
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
* Hide hint
*/
function hideHint() {
  $hint.css({visibility: 'hidden'});
}