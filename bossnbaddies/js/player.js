let player;

// Load the YouTube IFrame API script
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Called automatically by the YouTube IFrame API
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'dQw4w9WgXcQ',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  document.getElementById('player-status').textContent = 'Player ready.';
}

function onPlayerStateChange(event) {
  const status = document.getElementById('player-status');

  switch (event.data) {
    case YT.PlayerState.UNSTARTED:
      status.textContent = 'Video unstarted.';
      break;
    case YT.PlayerState.ENDED:
      status.textContent = 'Video ended.';
      break;
    case YT.PlayerState.PLAYING:
      status.textContent = 'Video playing.';
      break;
    case YT.PlayerState.PAUSED:
      status.textContent = 'Video paused.';
      break;
    case YT.PlayerState.BUFFERING:
      status.textContent = 'Video buffering.';
      break;
    case YT.PlayerState.CUED:
      status.textContent = 'Video cued.';
      break;
    default:
      status.textContent = 'Player state changed.';
  }
}

function playVideo() {
  if (player) player.playVideo();
}

function pauseVideo() {
  if (player) player.pauseVideo();
}

function stopVideo() {
  if (player) player.stopVideo();
}
