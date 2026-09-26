'use strict';
import { SoundSource } from './soundSource';
import sono from 'sono';
import { so } from './soundObject';

class Terrain {
	constructor(z, type, depth, threed=false, sounds=true) {
		this.z = Number(z);
		this.type = type;
		this.depth = Number(depth);
		this.sounds = sounds;
		if (sounds == true) {
			this.sndBodyfall = new Array();
			for (var i=0;i<6;i++) {
				this.sndBodyfall.push(so.create("crashes/body"+this.type+(i+1)));
			}
			this.sndSlide = so.create("crashes/slide"+this.type)
		}
		
		this.sndLoop = so.create("vehicles/tire"+this.type);
		this.sndLand = so.create("vehicles/land"+this.type);
		this.sndLoop.volume = 0.5;
		this.threed = threed;
		this.panner = 0;
		if (threed == true) {
			
			this.panner = this.sndLoop.effects.add(sono.panner());
		}
		
		
	}
	
	pos(x, y, z) {
		if (this.threed) {
			this.panner.setPosition(x, y, z);
		}
	}
	
	check(player) {
		if (player.z > this.z && player.z < this.z+this.depth && player.y < 1) {
			return true;
		}
		return false;
	}
	play() {
		if (this.sndLoop.playing == false) {
			this.sndLoop.play();
		}
		
	}
	
	stop() {
		if (this.sndLoop.playing) {
			this.sndLoop.stop();
		}
	}
	
	setSpeed(speed) {
		this.sndLoop.playbackRate = 0+(speed/8);
	}
	land() {
		this.sndLand.play();
	}
	destroy() {
		this.sndLoop.destroy();
		
		this.sndLand.destroy();
		if (this.sounds == true) {
			this.sndBodyfall.forEach(function(sound) {
				sound.destroy();
			});
			this.sndSlide.destroy();
		}
		this.toDestroy=true;
	}
}

export default Terrain;
