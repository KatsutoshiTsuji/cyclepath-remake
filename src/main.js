import { so } from './soundObject';
import sono from 'sono';
import Game from './game';
import { KeyEvent } from './keycodes';
import $ from 'jquery';

var sound = null;
var gameStarted = false;

function init() {
  const startBtn = document.getElementById('startButton');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBtn.style.display = 'none';
      unlockAudioAndPlayIntro();
    });
    startBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        startBtn.style.display = 'none';
        unlockAudioAndPlayIntro();
      }
    });
  }

  // キーボードでも直接開始できるように
  $(document).on('keydown.initial', function(e) {
    if (e.which === KeyEvent.DOM_VK_SPACE || e.which === KeyEvent.DOM_VK_RETURN) {
      if (startBtn) startBtn.style.display = 'none';
      $(document).off('keydown.initial');
      unlockAudioAndPlayIntro();
    }
  });
}

function unlockAudioAndPlayIntro() {
  if (gameStarted) return;
  gameStarted = true;

  if (sono.ctx && sono.ctx.state === 'suspended') {
    sono.ctx.resume();
  }

  playIntro();
}

function playIntro() {
  sound = so.create("intro");
  sound.play();
  sound.on("ended", startGame);

  var id = document.getElementById("touchArea");
  if (id) {
    id.style.display = 'block';
    id.onclick = () => {
      $(document).off("keydown.skipIntro");
      id.onclick = function() { };
      if (sound) sound.destroy();
      startGame();
    };
  }

  $(document).on("keydown.skipIntro", function(event) {
    if (event.which == KeyEvent.DOM_VK_SPACE || event.which == KeyEvent.DOM_VK_RETURN) {
      $(document).off("keydown.skipIntro");
      if (sound) sound.destroy();
      startGame();
    }
  });
}

function startGame() {
  var game = new Game();
  game.initGame();
}

$(document).ready(init);
