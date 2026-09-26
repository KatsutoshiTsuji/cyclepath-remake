'use strict';
import Player from './player';
import EngineSound from './engineSound';
import Ramp from './ramp';
import Item from './item';
import Tunnel from './tunnel';
import { so } from './soundObject';
import { SoundSource } from './soundSource';
import Terrain from './terrain';
import Enemy from './enemy';
import ScoreData from './scoreData';
import InputHandler from './inputHandler';
import sono from 'sono';
import { utils } from './utilities';
import SettingsLoader from './settingsLoader';
import NoSleep from 'nosleep.js';
var ns = new NoSleep();
class World {
	constructor(player, world, options=0, achievementHandler=0, stats=0, endCallback=0) {
		this.active = true;
		this.terrains = new Array();
		this.enemies = new Array();
		this.mainAmbience = null;
		this.ambiences = new Array();
		this.items = new Array();
		this.tunnels = new Array();
		this.ramps = new Array();
		this.enemiesToSpawn = world.enemiesToSpawn;
		this.ambiencesToSpawn = world.ambiencesToSpawn;
		this.terrainsToSpawn = 2;
		this.rampsToSpawn = world.rampsToSpawn;
		console.log("Ramps to spawn " + this.rampsToSpawn);
		this.itemsToSpawn = world.itemsToSpawn;
		this.spawnTunnels = options.spawnTunnels;
		this.spawnRamps = options.spawnRamps;
		this.spawnLength = world.spawnLength;
		this.spawnThreshhold = world.spawnThreshhold;
		
		this.minSpawnDistance = world.minSpawnDistance;
		this.allowEffects = options.allowEffects;
		
		this.player = player;
		this.playerStats = stats;
		this.playerStats.numberOfGames++;
		
		this.gameStats = {
			score:0,
			level:1,
			scoreMultiplier:1,
			scoreUntilNextLevel:1500,
			playTime:Date.now(),
			travelDistance:0,
			airTime:0,
			collectedCoins:0
		}
		this.scoreData = new ScoreData();
		this.leftBorder = world.leftBorder;
		this.rightBorder = world.rightBorder;
		this.leftEdge = world.leftEdge;
		this.rightEdge = world.rightEdge;
		this.edgeTerrain = new Terrain(0, "NearWall", 0, true, false)
		this.type = world.type;
		this.lethalWalls = options.lethalWalls;
		this.effectsReverb = 0;
		
		this.achievementHandler = achievementHandler;
		
		this.numberOfAmbiences=world.numberOfAmbiences;
		this.inputHandler = new InputHandler(this, options.doGyro);
		this.endCallback = endCallback;
		this.fixedUpdateTimer = performance.now();
		this.init();
		
	}
	
	addTerrain(z, type, length, threed=true) {
		
		this.terrains.push(new Terrain(Number(z), type, Number(length), threed));
	}
	addRamp(x, y, z, width, height, depth) {
		this.ramps.push(new Ramp(x, y, z, width, height, depth));
	}
	
	addAmbience(x, y, z, file) {
		this.ambiences.push(new SoundSource(file, x, y, z));
	}
	playAmbiences() {
		this.ambiences.forEach(function(ambience) {
			if (!ambience.playing) ambience.play();
		});
	}
	
	
	stopAmbiences() {
		this.ambiences.forEach(function(ambience) {
			if (ambience.playing) ambience.stop();
		});
	}
	
	addTunnel(z, type, depth) {
		this.tunnels.push(new Tunnel(z, type, depth));
	}
	addItem(x, y, z, type) {
		this.items.push(new Item(x, y, z, 30, 30, 30, type));
	}
	init() {
		ns.enable();
		
		
		if (this.allowEffects==true) {
			this.effectReverb = sono.effects.add(sono.reverb({time:0.5,decay:0.7}));
		} else this.effectsReverb = 0;
		
		this.player.lastTerrain = new Terrain(0, "Asphalt", 0, true, false)
		this.mainAmbience = so.create("ambience/"+this.type+"/a"+utils.randomInt(1, 3));
		this.mainAmbience.loop = true;
		this.mainAmbience.volume = 0.5;
		this.mainAmbience.play();
	}
	tick() {
		var that = this;
		if (this.active == true) {
			window.requestAnimationFrame(function() { that.tick(); });
			this.update();
		} else {
			this.updateStats();
		}
		
		
	}
	
	updateStats() {
		var settingsLoader = new SettingsLoader();
		this.gameStats.playTime = (((Date.now()-this.gameStats.playTime)/1000)/60);
		this.playerStats.playTime += this.gameStats.playTime;
		this.playerStats.score += this.gameStats.score;
		settingsLoader.saveStats(this.playerStats);
		settingsLoader.saveAchievements(this.achievementHandler.achievementWatcher.achievements);
		
	}
	
	update() {
		
		
		
		if (performance.now()-this.fixedUpdateTimer > 500) {
			this.achievementHandler.updateAllValues(this.playerStats);
			this.achievementHandler.checkLockedAchievements();
			if (this.spawnTunnels) this.checkTunnels();
			this.handleLoading();
			this.handleDeloading();
		}
		
		
		
			this.inputHandler.update();
			
			
			this.checkEnemies();
			if (this.player.toDestroy==false) this.player.update();
			this.checkPlayer();
			this.checkTerrain();
			this.checkSources();
			
			this.checkItems();
			if (this.spawnRamps) this.checkRamps();
			this.checkBoundaries();
			this.handleColisions();
			
		
	}
	checkRamps() {
		for (var i=0;i<this.ramps.length;i++) {
			if (utils.isCollide3D(this.player, this.ramps[i])) {
				this.increaseScore(this.scoreData.jumpRamp);
				this.player.jump();
			}
		}
	}
	
	checkItems() {
		if (this.player.crashed == false) {
			for (var i=0;i<this.items.length;i++) {
			
				if (utils.isCollide3D(this.player, this.items[i])) {
					this.player.sndCollectCoin.play();
					if (this.player.flying == true) {
						this.player.sndCoinMultiplier.play();
						this.player.sndCoinMultiplier.playbackRate += 0.1;
					}
					
					switch (this.items[i].type) {
						case 1:
							this.playerStats.coins++;
							this.gameStats.collectedCoins++;
							break;
						case 2:
							this.playerStats.coins += 10;
							this.gameStats.collectedCoins += 10;
							break;
						case 3:
							this.playerStats.coins+=50;
							this.gameStats.collectedCoins += 50;
							break;
					}
					this.items[i].destroy();
					
				}
			}
		}
	}
	
	checkTunnels() {
		var found=0;
		for (var i=0;i<this.tunnels.length;i++) {
			if (this.tunnels[i].check(this.player)) {
				found = true;
				if (this.allowEffects) sono.effects[0].decay = this.tunnels[i].type;
				
			}
		}
		if (found == 0) {
			if (this.allowEffects==true) sono.effects[0].decay = 0.5;
		}
	}
	checkSources() {
		var direction=0;
		for (var i=0;i<this.ambiences.length;i++) {
			if (utils.distance(this.ambiences[i].x, this.ambiences[i].z, this.player.x, this.player.z) < this.spawnLength) {
				
				if (this.ambiences[i].z > this.player.z) {
					direction=1;
				} else {
					direction = -1;
				}
				
				this.ambiences[i].setDoppler(this.player.z, this.player.speed, direction);
			
			
			} else {
				this.ambiences[i].destroy();
			}
			
		}
	}
	checkEnemies() {
		var direction=0;
		for (var i=0;i<this.enemies.length;i++) {
			this.enemies[i].update();
			
			if (utils.distance(this.enemies[i].x, this.enemies[i].z, this.player.x, this.player.z) < this.spawnLength) {
				
				if (this.enemies[i].z > this.player.z) {
					direction=1;
				} else {
					direction = -1;
					if (this.enemies[i].justPassed == false) {
						this.enemies[i].justPassed = true;
						var rate = 1-(utils.distance(this.enemies[i].x+this.enemies[i].width/2, this.enemies[i].z+this.enemies[i].depth/2, this.player.x+this.player.width/2, this.player.z+this.player.depth/2)/1000)
						this.increaseScore(rate*this.scoreData.passCar)
						if (this.player.flying == true && this.player.ragdoll == false) {
							this.increaseScore(this.scoreData.jumpOverCar);
							this.player.sndJumpOverCar.playbackRate += 0.1;
							this.player.sndJumpOverCar.play();
						}
						
						
						
						this.player.sndPassCar.playbackRate = rate;
						this.player.sndPassCar.seek(0);
						this.player.sndPassCar.play();
						this.playerStats.numberOfCars++;
					}
				}
				
				this.enemies[i].setDoppler(this.player.z, this.player.speed, direction);
			
			
		
			
			} else {
				this.enemies[i].destroy();
			}
		}
		
	}
	
	checkTerrain() {
		for (var i=0;i<this.terrains.length;i++) {
			if (this.terrains[i].check(this.player) == true) {
				
				this.player.lastTerrain = this.terrains[i];
				if (this.player.flying == false) {
					
					this.terrains[i].pos(this.player.x, this.player.y-1, this.player.z+this.player.depth+5)
					this.terrains[i].play();
					this.terrains[i].setSpeed(this.player.speed);
				}
				
				if (this.player.landing == true) {
					this.terrains[i].land();
					this.player.landing = false;
				}
				
			} else {
				
				this.terrains[i].stop();
				
				
			}
		}
	}
	
	checkBoundaries() {
		if (this.player.x < this.leftEdge) {
			if (!this.edgeTerrain.playing) this.edgeTerrain.play();
			this.edgeTerrain.pos(this.leftBorder, 0, this.player.z);
			this.edgeTerrain.setSpeed(this.player.speed);
		} else if(this.player.x > this.rightEdge) {
			if (!this.edgeTerrain.playing) this.edgeTerrain.play();
			this.edgeTerrain.pos(this.rightBorder, 0, this.player.z);
			
			this.edgeTerrain.setSpeed(this.player.speed);
			
		} else {
			this.edgeTerrain.stop();
		}
		
		if (this.lethalWalls == true) {
			if (this.player.x < this.leftBorder || this.player.x > this.rightBorder) {
			
				if (this.player.ragdoll == false) this.player.crash(this.player.speed);
				
			}
		} else {
			if (this.player.x < this.leftBorder) {
				this.player.x = this.leftBorder;
				this.player.theta -= utils.getRandomArbitrary(0.1, 0.2);;
			} else if (this.player.x > this.rightBorder) {
				this.player.theta += utils.getRandomArbitrary(0.1, 0.2);
				this.player.x = this.rightBorder;
			}
			
		}
	}
	
	handleLoading() {
		
		if ((this.ambiences.length/this.ambiencesToSpawn) < this.spawnThreshhold) {
			var zOffset = this.player.z;
			var xOffset = 0;
			while (this.ambiences.length<this.ambiencesToSpawn) {
				var direction = utils.randomInt(0, 2);
				if (direction == 0) {
					xOffset = utils.randomInt(this.leftBorder-300, this.leftBorder);
				} else {
					xOffset = utils.randomInt(this.rightBorder, this.rightBorder+300);
				}
				
				this.ambiences.push(new SoundSource("ambience/"+this.type+"/r"+utils.randomInt(1, this.numberOfAmbiences), xOffset, -2, utils.randomInt(zOffset+this.minSpawnDistance, zOffset+this.spawnLength)));
			}
			this.playAmbiences();
		}
		
		if ((this.enemies.length/this.enemiesToSpawn) < this.spawnThreshhold) {
			
			while (this.enemies.length<this.enemiesToSpawn) {
				
				var xOffset = utils.randomInt(this.leftEdge, this.rightEdge);
			
				var zOffset = this.player.z;
				var maxSpeed = 15;
				this.enemies.push(new Enemy(xOffset, 0, utils.randomInt(zOffset+this.minSpawnDistance, zOffset+this.spawnLength), utils.randomInt(4, maxSpeed), utils.randomInt(1, 38)));
			}
		}
		
		if ((this.items.length/this.itemsToSpawn) < this.spawnThreshhold) {
			if (this.spawnRamps == true) {
				if (this.ramps.length > 0) {
					
					while (this.items.length<this.itemsToSpawn) {
						var ramp = utils.randomInt(0, this.ramps.length);
						var zPosition = utils.randomInt(this.ramps[ramp].z+this.ramps[ramp].depth+1000, this.ramps[ramp].z+this.ramps[ramp].depth+2500);
						var xPosition = utils.randomInt(this.ramps[ramp].x-250, this.ramps[ramp].x+250);
						var yPosition = utils.randomInt(1000, 1200);
						this.items.push(new Item(xPosition, yPosition, zPosition, utils.randomInt(1, 3)));
					}  // end while
				} // end if
			} else {
				
				while (this.items.length<this.itemsToSpawn) {
					var xOffset = utils.randomInt(this.leftEdge, this.rightEdge);
			
					var zOffset = this.player.z;
					this.items.push(new Item(xOffset, 0, utils.randomInt(zOffset+this.minSpawnDistance, zOffset+this.spawnLength), utils.randomInt(1, 3)));
				} // end while
				
			} // end if
		} // end if
		if (this.spawnRamps==true) {
		if ((this.ramps.length/this.rampsToSpawn) < this.spawnThreshhold) {
			
			while (this.ramps.length<this.rampsToSpawn) {
				
				var xOffset = utils.randomInt(this.leftEdge, this.rightEdge);
			
			var zOffset = this.player.z;
				this.ramps.push(new Ramp(xOffset, 0, utils.randomInt(zOffset+this.minSpawnDistance, zOffset+this.spawnLength), 150, utils.randomInt(1, 3), 100));
			}
		}
		}
		
		
		if (this.terrains.length < 2) {
			
			var zOffset = this.player.z;
			while (this.terrains.length < this.terrainsToSpawn) {
				
				var length = utils.randomInt(this.minSpawnDistance, this.spawnLength);
				var type = utils.randomInt(0, 3);
				if (type == 0) {
					type = "Asphalt";
				} else if (type == 1) { 
					type = "Dirt";
				} else {
					type = "Water";
				}
			
				this.addTerrain(zOffset, type, zOffset+length);
				zOffset += length;
			}
			
		}
		if (this.spawnTunnels == true) {
			if (this.tunnels.length < 1) {
				
				var zOffset = this.player.z+this.spawnLength;
				var length = utils.randomInt(this.minSpawnDistance, this.spawnLength);
				var type = utils.randomInt(5,7);
				
				
			
				this.addTunnel(zOffset, type, zOffset+length);
			}
		}
		
	}
	handleDeloading() {
		for (var i=0;i<this.terrains.length;i++) {
			if (this.terrains[i].z+this.terrains[i].depth < this.player.z-this.spawnLength) {
				this.terrains[i].destroy();
			}
			if (this.terrains[i].toDestroy == true) {
				this.terrains.splice(i, 1);
			}
		}
		if (this.spawnTunnels == true) {
		for (var i=0;i<this.tunnels.length;i++) {
			if (this.tunnels[i].z < this.player.z-this.spawnLength) {
				this.tunnels[i].destroy();
			}
			if (this.tunnels[i].toDestroy == true) {
				this.tunnels.splice(i, 1);
			}
		}
		}		
		for (var i=0;i<this.ambiences.length;i++) {
			if (this.ambiences[i].toDestroy==true) {
				this.ambiences.splice(i, 1);
				
			}
		}
		for (var i=0;i<this.ramps.length;i++) {
			
			if (this.ramps[i].z < this.player.z-this.spawnLength) {
				this.ramps[i].destroy();
			}
			if (this.ramps[i].toDestroy==true) {
				this.ramps.splice(i, 1);
				
			}
		}
		
		for (var i=0;i<this.items.length;i++) {
			
			if (this.items[i].z < this.player.z-this.spawnLength) {
				this.items[i].destroy();
			}
			if (this.items[i].toDestroy==true) {
				this.items.splice(i, 1);
				
			}
		}
		
		for (var i=0;i<this.enemies.length;i++) {
			if (this.enemies[i].toDestroy==true) {
				this.enemies.splice(i, 1);
				
			}
		}
		
	}
	
	
	handleColisions() {
		for (var i=0;i<this.enemies.length;i++) {
			if (utils.isCollide3D(this.player, this.enemies[i])) {
				if (this.player.invincible == true) {
					this.enemies[i].sndBump.play();
					this.increaseScore(this.scoreData.scrapeCar);
				} else if (this.player.ragdoll == true) {
					this.player.continueCrash(this.enemies[i].speed);
				} else {
					if (utils.distance3D(this.enemies[i].x, this.enemies[i].y, this.enemies[i].z, this.player.x, this.player.y, this.player.z) < this.enemies[i].width/4) {
						this.player.crash(this.enemies[i].speed);
					} else {
						this.enemies[i].sndBump.play();
						this.increaseScore(this.scoreData.scrapeCar);
					}
				}
			}
		}
	}
	checkPlayer() {
		if (this.player.isDead && this.player.canRespawn == false) {
			this.active = false;
			
			this.destroy();

			this.endCallback(this.gameStats);
		}
		this.gameStats.travelDistance += this.player.speed*Math.sin(this.player.theta);
		this.playerStats.travelDistance += this.player.speed*Math.sin(this.player.theta);
	}
	
	checkScore() {
		if (this.gameStats.score > this.gameStats.scoreUntilNextLevel) {
			this.gameStats.scoreMultiplier++;
			this.gameStats.scoreUntilNextLevel += this.gameStats.scoreUntilNextLevel*this.gameStats.scoreMultiplier;
			this.gameStats.level++;
			this.enemiesToSpawn = this.enemiesToSpawn+3;
			this.player.sndLevelUp.play();
		}
		
	}
	
	increaseScore(amount) {
		if (typeof this.gameStats.score == NaN) this.gameStats.score=0;
		
		this.gameStats.score += amount;
		this.checkScore();
	}
	
	destroy() {
		for (var i in this.ambiences) {
			this.ambiences[i].destroy();
		}
		for (var i in this.enemies) {
			this.enemies[i].destroy();
		}
		for (var i in this.items) {
			this.items[i].destroy();
		}
		for (var i in this.ramps) {
			this.ramps[i].destroy();
		}
		this.mainAmbience.destroy();
		for (var i in this.terrains) {
			this.terrains[i].destroy();
		}
		for (var i in this.tunnels) {
			this.tunnels[i].destroy();
		}
		// sono.stopAll();
		sono.destroyAll();
		if (this.inputHandler) this.inputHandler.destroy();
		this.player.destroy();
		this.edgeTerrain.destroy();
		this.active = false;
	}
	
	endGame() {
		ns.disable();
		
		this.active = false;
			
			this.destroy();

			this.endCallback(this.gameStats);
	}
	
}

export default World;