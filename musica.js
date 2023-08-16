
var song1 = new Audio('intro.ogg');
var song2 = new Audio('loop.ogg');

var songPlayed = false;

document.addEventListener('click', function() {

  if (!songPlayed) {
  
    song1.play();

  
    song1.onended = function() {
    
      song2.loop = true;
      song2.play();
    };

  
    var playbackRateIncrement = 0.007;
    var maxPlaybackRate = 10.0;
    var playbackRateInterval = setInterval(function() {
    
      song2.playbackRate += playbackRateIncrement;

    
      if (song2.playbackRate >= maxPlaybackRate) {
        clearInterval(playbackRateInterval);
      }
    }, 1000);

  
    song2.addEventListener('timeupdate', function() {
      var currentTime = song2.currentTime;
      var duration = song2.duration;
      var threshold = 0.1;

      if (duration - currentTime <= threshold) {
        song2.currentTime = 0;
      }
    });

  
    songPlayed = true;
  }
});

function resetBall() {
  pong.ball.x = pong.width / 2;
  pong.ball.y = pong.height / 2;
  pong.ball.dx = pong.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  pong.ball.dy = pong.ballSpeed * (Math.random() > 0.5 ? 1 : -1);


  song2.playbackRate = 1.0;
}

song1.volume = 0.25;
song2.volume = 0.25;

var volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', function() {
    song1.volume = volumeSlider.value / 100;
    song2.volume = volumeSlider.value / 100;
    }
);
