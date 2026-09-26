'use strict';
import { SoundSource } from './soundSource.js';
import { utils } from './utilities';
class Enemy {
	constructor(x, y, z, speed, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 150;
		this.height = 200;
		this.depth = 20;
		this.theta = 1.5*Math.PI;
		this.type = type;
		this.speed = speed;
		this.sound = new SoundSource("vehicles/npc/"+this.type, x, y, z);
		this.sound.loop = true;
		this.sound.sound.playbackRate = utils.getRandomArbitrary(0.9, 1.2);
		this.sound.play();
		this.sndBump = new SoundSource("crashes/bump"+utils.randomInt(1, 7));
		this.sndBump.sound.loop = false;
		this.toDestroy=false;
		this.justPassed=false;
	}
	
	update() {
		this.x += this.speed*Math.cos(this.theta);
		this.z += this.speed*Math.sin(this.theta);
		this.sound.pos(this.x+(this.width/2), this.y-2, this.z);
		this.sndBump.pos(this.x+(this.width/2), this.y-2, this.z);
		this.sound.setSpeed(this.speed);
	}
	
	setDoppler(z1, speed, direction) {
		this.sound.setDoppler(z1, speed, direction);
	}
	destroy() {
		this.sound.destroy();
		this.sndBump.destroy();
		this.toDestroy=true;
	}
}

export default Enemy;