'use strict';
import { KeyboardInput } from './input';
import Hammer from 'hammerjs';
import World from './world';
import { KeyEvent } from './keycodes';
import { TTS } from './tts';

if (typeof speech === 'undefined') var speech = new TTS();

class InputHandler {
	constructor(world, doGyro=false) {
		this.world = world;
		this.input = new KeyboardInput();
		if (doGyro == true) {
			var id = document.getElementById("touchArea");
			this.touchInput = new Hammer.Manager(id);
			this.hammerTap = new Hammer.Tap();
			this.touchInput.add(this.hammerTap);
			this.gn = new GyroNorm();
		}
		
		this.turnLeft = false;
		this.turnRight = false;
		this.doGyro = doGyro;
		this.init();
	}
	
	init() {
		var that = this;
		if (this.doGyro == true) {
			this.touchInput.on("tap", function(event) {
				that.world.player.startAccelerating();
			});
			this.gn.init().then(function() {
				that.gn.start(function(data) {
					if (data.dm.gx < -2) {
						that.world.player.startTurning(-1);
					} else if (data.dm.gx > 2) {
						that.world.player.startTurning(1);
					} else {
						that.world.player.stopTurning();
					}
				});
			});
		}
		this.input.init();
	}

	destroy() {
		this.input.destroy();
	}
	
	update() {
		if (this.input.isJustPressed(KeyEvent.DOM_VK_C)) {
			speech.speak(Math.round(this.world.player.x) + ", " + Math.round(this.world.player.y) + ", " + Math.round(this.world.player.z));
		}
		
		if (this.input.isJustPressed(KeyEvent.DOM_VK_Q)) {
			this.world.endGame();
			return;
		}
		
		// アクセル判定（Spaceキー または 上矢印）
		if (this.input.isDown(KeyEvent.DOM_VK_SPACE) || this.input.isDown(KeyEvent.DOM_VK_UP)) {
			this.world.player.startAccelerating();
		} else if (this.input.isJustReleased(KeyEvent.DOM_VK_SPACE) || this.input.isJustReleased(KeyEvent.DOM_VK_UP)) {
			this.world.player.stopAccelerating();
		}
		
		// 左ステアリング
		if (this.input.isJustPressed(KeyEvent.DOM_VK_LEFT)) {
			this.world.player.startTurning(-1);
		}
		if (this.input.isJustReleased(KeyEvent.DOM_VK_LEFT)) {
			if (!this.input.isDown(KeyEvent.DOM_VK_RIGHT)) {
				this.world.player.stopTurning();
			}
		}

		// 右ステアリング
		if (this.input.isJustPressed(KeyEvent.DOM_VK_RIGHT)) {
			this.world.player.startTurning(1);
		}
		if (this.input.isJustReleased(KeyEvent.DOM_VK_RIGHT)) {
			if (!this.input.isDown(KeyEvent.DOM_VK_LEFT)) {
				this.world.player.stopTurning();
			}
		}
	}
}

export default InputHandler;
