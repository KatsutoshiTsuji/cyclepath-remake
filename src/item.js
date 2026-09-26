'use strict';
import { SoundSource } from './soundSource.js';
import { utils } from './utilities';
class Item {
	constructor(x, y, z, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 400;
		this.height = 400;
		this.depth = 400;
		this.type = type;
		this.sndLoop = new SoundSource("items/coin"+this.type, x+this.width/2, y+this.height/2, z+this.depth/2);
		this.sndLoop.sound.playbackRate = utils.getRandomArbitrary(0.8, 1.3);
		this.sndLoop.play();
		this.toDestroy = false;
	}
	
	destroy() {
		
		this.sndLoop.destroy();
		this.toDestroy = true;
	}
}
export default Item;