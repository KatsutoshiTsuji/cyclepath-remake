'use strict';
import { so } from './soundObject';
import EngineSound from './engineSound';
import { utils } from './utilities';
import sono from 'sono';
class Player {
	constructor(bike, turnMode=0, canRespawn=false, deathCallback=null, invincible=false) {
		this.x = 5;
		this.y = 0;
		this.z = 0;
		this.width = 50;
		this.height = 10;
		this.depth = 20;
		this.theta = 0.5*Math.PI;
		this.speed = 0;
		this.maxSpeed = bike.maxSpeed;
		this.acceleration = bike.acceleration;
		this.bike = bike;
		this.jumpForce = 20;
		this.health = 100;
		this.crashed = false;
		this.flying = 0;
		this.gravity = 0.45;
		this.landing = false;
		this.turnSpeedFactor = bike.turnSpeedFactor;
		this.ragdoll = false;
		this.ragdollSubtract = 12;
		this.turnMode = turnMode;
		this.ySpeed = 0;
		this.engine = null;
		this.invincible = invincible;
		this.sndStartTurning = null;
		this.sndTurningLoop = null;
		this.sndStopTurning = null;
		this.sndBodyfall = null;
		this.sndSlide = null;
		this.sndBikeCrash = null;
		this.sndJump = null;
		this.sndLevelUp = null;
		this.sndCollectCoin = null;
		this.sndCoinMultiplier = null;
		this.sndPassCar = null;
		this.sndJumpOverCar = null;
		this.sndWind = null;
		this.turning = 0;
		this.turnDirection = 0;
		this.leftThetaLimit = 0.1;
		this.rightThetaLimit = Math.PI-0.1;
		this.isDead = false;
		this.canRespawn = canRespawn;
		this.lastTerrain = 0;
		this.deathCallback = deathCallback;
		this.toDestroy = false;
	}
	
	init() {
		this.engine = new EngineSound(this.bike.engineType, this.bike.gears, this.bike.maxAccelerate, this.bike.minRate);
		
		this.sndJump = so.create("vehicles/rampJump");
		
		this.sndWind = so.create("vehicles/wind");
		this.sndWind.play();
		this.sndWind.playbackRate = 0.1;
		this.sndWind.loop = true;
		this.sndCoinMultiplier = so.create("ui/coinCounter");
		
		this.sndBikeCrash = so.create("crashes/bike"+utils.randomInt(1, 7));
		this.sndLevelUp = so.create("ui/levelUp");
		this.sndCollectCoin = so.create("items/getCoin");
		
		this.sndPassCar = so.create("ui/carPassed");
		this.sndJumpOverCar = so.create("ui/carPassedAir");
		
		this.z = 5;
		this.engine.startEngine();
	}
	
	checkMovement() {
		if (this.turnMode == 0) {
			this.theta = 0.5*Math.PI;
		}
		this.x += this.speed*Math.cos(this.theta);
		this.z += this.speed*Math.sin(this.theta);
		if (this.moving == 0 && this.speed > 0) {
			this.speed -= this.acceleration;
			
		}
	}
	
	checkSpeed() {
		if (this.moving == 1) {
			if (this.speed < this.maxSpeed) this.speed += this.acceleration;
		}
	}
	
	update() {
		if (this.speed > 0) this.sndWind.playbackRate = (Math.abs(this.speed)/20)+(Math.abs(this.ySpeed)/8)/2;
		if (this.ragdoll == false) {
			this.checkSpeed();
			this.checkMovement();
			this.checkFlying();
			this.handleTurning();
			this.engine.update();
		} else {
			this.handleRagdoll();
		}
		sono.panner.setListenerPosition(this.x, this.y, this.z);
		sono.panner.setListenerOrientation(Math.cos(this.theta), 0, Math.sin(this.theta), 0, 1, 0);
		
	}
	
	checkFlying() {
		if (this.flying == true) {
			
			this.y += this.ySpeed;
			this.ySpeed -= this.gravity/3;
			if (this.y < 0) {
				this.land();
			}
		}
	}
	
	startAccelerating() {
		if (this.moving !== 1) {
			this.moving = 1;
			this.engine.accelerate();
		}
	}
	jump() {
		this.sndJump.play();
		this.sndJumpOverCar.playbackRate = 1;
		this.sndCoinMultiplier.playbackRate = 1;
		this.moving = 0;
		this.ySpeed = this.jumpForce;
		this.flying = true;
		this.engine.decelerate();
		
	}
	land() {
		this.y = 0;
		
		this.ySpeed = 0;
		this.flying = false;
		this.landing = true;
		this.engine.accelerate();
		this.moving = true;
		
	}
	stopAccelerating() {
		this.moving = 0;
		this.engine.decelerate();
	}
	
	startTurning(direction) {
		
			if ((direction < 0 && this.theta >= this.leftThetaLimit) || (direction > 0 && this.theta <= this.rightThetaLimit)) {
				if (this.turnMode == 1) direction /= this.turnSpeedFactor*2;
			
				if (this.turning == 0) {
				
					// if (this.speed > 3) this.sndStartTurning.play();
					this.turning = 1;
					this.turnDirection = direction;
				}
			}
		
	}
	
	handleTurning() {
		if (this.turning == 1) {
			
			
			
			if (this.turnMode == 1) {
				this.theta += this.turnDirection;
				if (this.theta < this.leftThetaLimit) {
					this.theta = this.leftThetaLimit;
					// this.stopTurning();
				} else if(this.theta > this.rightThetaLimit) {
					this.theta = this.rightThetaLimit;
					// this.stopTurning();
				}
			} else {
				
				this.x -= this.turnDirection*8;
			}
		}
	}
	
	stopTurning() {
		
		// if (this.sndStartTurning.playing) this.sndStartTurning.stop();
		// if (this.sndTurningLoop.playing) this.sndTurningLoop.stop();
		// this.sndStopTurning.play();
		this.turning = 0;
		this.turnDirection = 0;
		// this.theta = 0.5*Math.PI;
	}
	crash(speed) {
		if (this.invincible) return;
		if (this.ragdoll == false) {
			if (speed == 0) speed = 1;
			this.sndBikeCrash.play();
			this.crashed = true;
			this.engine.stopEngine();
			this.ragdoll = true;
			this.speed = 1+(this.speed+speed);
			this.ySpeed = (this.speed+speed);
			this.turnDirection = utils.getRandomArbitrary(-0.1, 0.1);
			// this.ragdollSubtract = 1+speed*1.5;
			this.flying = true;
		}
	}
	
	continueCrash(speed) {
		
			
			this.sndBikeCrash.play();
			this.engine.stopEngine();
			this.ragdoll = true;
			this.speed = (this.speed+speed);
			this.ySpeed = (this.speed+speed);
			this.turnDirection = utils.getRandomArbitrary(-0.1, 0.1);
			// this.ragdollSubtract = speed*1.5;
			this.flying = true;
		
	}
	handleRagdoll() {
		if (this.ySpeed != 0) {
			this.ySpeed -= this.gravity;
			this.y += this.ySpeed;
			
			
			if (this.y < 0 && this.ySpeed < 0) {
				this.theta += this.turnDirection*this.ySpeed;
				this.lastTerrain.sndBodyfall[utils.randomInt(0, this.lastTerrain.sndBodyfall.length-1)].play();
				
				this.ySpeed *= -1;
				this.ySpeed -= this.ragdollSubtract
				if (this.ySpeed < 0.1) this.ySpeed = 0;
				if (this.ySpeed > 0.01) this.ySpeed -= 0.1;
			}
			
		}
		
		if (this.ySpeed == 0) {
			this.ySpeed = 0;
			this.y = 0;
			if (!this.lastTerrain.sndSlide.playing) this.lastTerrain.sndSlide.play();
		}
		this.x += this.speed*Math.cos(this.theta);
		this.z += this.speed*Math.sin(this.theta);
		if (this.speed > 0) this.speed -= this.ragdollSubtract/192;
		if (this.speed < 0.01 && this.ySpeed == 0) {
			
			this.die();
		}
	}
	die() {
	if (typeof deathCallback != "undefined") deathCallback();
		this.ragdoll = false;
		this.crashed = false;
		this.moving = 0;
		this.speed = 0;
		this.ySpeed = 0;
		if (this.canRespawn == true) {
			this.engine.startEngine();
			this.x = 0;
		} else {
			this.isDead = true;
		}
	}
	
	destroy() {
		this.toDestroy = true;
		this.engine.destroy();
		
		
		this.sndWind.destroy();
		
		this.sndBikeCrash.destroy();
		this.sndJump.destroy();
		this.sndLevelUp.destroy();
		this.sndCollectCoin.destroy();
		this.sndPassCar.destroy();
		this.sndCoinMultiplier.destroy();
		this.sndJumpOverCar.destroy();
	}
	
}

export default Player;
