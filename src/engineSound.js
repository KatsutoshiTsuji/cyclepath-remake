'use strict';
import { so } from './soundObject.js';
import { utils } from './utilities';

class EngineSound {
	constructor(type, gears, maxAccelerate=1, minRate=0.7, speedFactor=0.0025) {
		this.started = false;
		this.type = type;
		this.gears = gears;
		this.currentGear = 0;
		this.currentAccelerateSound = 0;
		this.accelerateSounds = maxAccelerate;
		
		this.rateFactor = 0.8;
		this.minRate = 0.8;
		this.maxRate = 1;
		this.rate = this.maxRate;
		this.idling=1;
		this.state=0;
		this.shiftTime = 5000;
		this.timer = new Date();
		this.time=this.timer.getMilliseconds();
		
		this.states ={
			idling:0,
			accelerating:1,
			decelerating:2,
			shifting:3,
			maxing:4
		}
		this.speedFactor = speedFactor;
		this.maxVolume = 0.4;
		this.sndAccelerate = new Array();
		for (var i=0;i<this.accelerateSounds;i++) {
			this.sndAccelerate.push(so.create("vehicles/"+this.type+"/accelerate"+(i+1)));
			
		}
		
		this.sndDecelerate = so.create("vehicles/"+this.type+"/decelerate");
		this.sndIdle = so.create("vehicles/"+this.type+"/idle");
		this.sndIdle.loop = true;
		this.sndLoop = so.create("vehicles/"+this.type+"/high");
		this.sndLoop.loop = true;
		this.sndShift = so.create("vehicles/"+this.type+"/shift");
		this.sndStart = so.create("vehicles/"+this.type+"/start");
		this.sndStart.volume = this.maxVolume;
		this.sndShift.volume = this.maxVolume;
		this.sndDecelerate.volume = this.maxVolume;
		
	}
	startEngine() {
		this.sndStart.play();
		this.sndIdle.play();
		this.currentGear = 0;
		this.started = true;
	}
	
	accelerate() {
		if (this.started) {
			if (this.state != this.states.accelerating) {
				if (this.sndIdle.playing) this.sndIdle.stop();
				if (this.sndDecelerate.playing) this.sndDecelerate.stop();
				this.rateFactor = ((this.maxRate-this.currentGear/this.gears > this.minRate) ? this.maxRate-this.currentGear/this.gears : this.minRate);
				this.rate = utils.getRandomArbitrary(this.rateFactor, this.rateFactor+0.1);
				this.currentAccelerateSound = utils.randomInt(0, this.accelerateSounds-1);
				this.sndAccelerate[this.currentAccelerateSound].playbackRate = this.rate;
				this.sndAccelerate[this.currentAccelerateSound].volume = this.maxVolume;
				this.sndAccelerate[this.currentAccelerateSound].play();
				this.state = this.states.accelerating;
				this.idling=0;
			}
		}
	}
	
	decelerate() {
		if (this.started) {
			if (this.state != this.states.decelerating) {
				this.sndDecelerate.play();
				this.sndAccelerate.forEach(function(sound) {
					sound.stop();
				});
				this.sndLoop.stop();
				this.state = this.states.decelerating;
			}
		}
		
	}
	
	
	
	update() {
		if (this.started) {
			if (this.state == this.states.accelerating) { this.handleAccelerating(); }
			if (this.state == this.states.decelerating) { this.handleDecelerating(); }
			if (this.state == this.states.shifting) { this.handleShifting(); }
			if (this.state == this.states.maxing) { this.handlePitch(); }
		}
	}
	
	handleAccelerating() {
		if (this.sndAccelerate[this.currentAccelerateSound].progress > 0.99 || this.sndAccelerate[this.currentAccelerateSound].ended) {
			this.max();
		}
	}
	max() {
		if (this.started) {
			this.sndAccelerate[this.currentAccelerateSound].fade(0, 0.1);
			this.sndLoop.volume = 0;
			this.sndLoop.playbackRate = this.rate;
			this.sndLoop.fade(this.maxVolume, 0.1);
			this.state = this.states.maxing;
			this.sndLoop.play();
		}
	}
	
	shift() {
		if (this.started) {
			this.sndShift.play();
			this.sndLoop.fade(0, 0.1);
			this.sndLoop.stop();
			this.sndAccelerate[this.currentAccelerateSound].stop();
			this.state = this.states.shifting;
			this.currentGear++;
		
			if (this.speedFactor > this.minSpeedFactor) this.speedFactor -= 0.0005;
			if (this.rateFactor > this.minRate) this.rateFactor -= 0.05;
		}
	}
	
	handlePitch() {
		if (this.sndLoop.playbackRate < this.maxRate) {
			
			this.sndLoop.playbackRate += this.speedFactor;
		} else {
			if (this.currentGear < this.gears) {
				this.shift();
			}
		}
		
		
	}
	
	handleShifting() {
		if (this.sndShift.progress > 0.9 || this.sndShift.ended) {
			this.accelerate();
		}
	}
	
	handleDecelerating() {
		if (this.currentGear == 0) {
			this.idle();
		}
		
		if ((this.sndDecelerate.ended) && this.currentGear > 0) {
			
			this.currentGear--;
			this.rate = utils.getRandomArbitrary(this.rateFactor, this.rateFactor+0.1);
			if (this.rateFactor > 0.2) this.rateFactor -= 0.1;
				
			this.sndDecelerate.playbackRate = this.rate;
			this.sndDecelerate.seek(0);
			this.sndDecelerate.play();
		}
		
	}
	idle() {
		this.rateFactor = this.minrate+this.maxRate/2;
		this.sndDecelerate.stop();
		this.sndLoop.stop();
		this.sndIdle.play();
		this.state = this.states.idling;
	}
	stopEngine() {
		this.started = false;
		this.sndShift.stop();
		this.sndDecelerate.stop();
		this.sndAccelerate.forEach(function(sound) {
			sound.stop();
		});
		this.sndLoop.stop();
		this.sndIdle.stop();
		this.state = -1;
	}
	
	destroy() {
		this.sndAccelerate.forEach(function(sound) {
			sound.destroy();
		});
		
		
		this.sndDecelerate.destroy();
		this.sndIdle.destroy();
		
		this.sndLoop.destroy();
		
		this.sndShift.destroy();
		this.sndStart.destroy();
		
		
		
		
	}
	
}

export default EngineSound;