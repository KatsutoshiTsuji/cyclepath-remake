'use strict';
import { SoundSource } from './soundSource.js';
class Coin {
	constructor(x, y, z, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 50;
		this.height = 10;
		this.depth = 50;
		this.type = type;
		this.sound = new SoundSource("items/coin"+this.type);
		this.sound.play();
		
	}
}

export default Coin;