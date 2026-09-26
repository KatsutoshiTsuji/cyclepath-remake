'use strict';
import { SoundSource } from './soundSource.js';
import { utils } from './utilities';
class Ramp {
	constructor(x, y, z, width, height, depth) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.sound = new SoundSource("items/ramp", true);
		this.sound.pos(this.x+this.width/2, this.y+this.height/2, this.z+this.depth/2);
		this.sound.play();
		this.sound.sound.playbackRate = utils.getRandomArbitrary(0.8, 1.2);
		this.toDestroy = false;
	}
	
	destroy() {
		this.sound.destroy();
		this.toDestroy=true;
	}
	
}

export default Ramp;
