'use strict';
import { so } from './soundObject';
class WorldLoader {
	constructor() {
		this.worlds = new Array();
		this.populateWorlds();
		
		this.timeToLoad = null;
		this.loadedCallback = null;
		this.sndProgress = so.create("ui/loading");
	}
	
	populateWorlds() {
		var world = {
			enemiesToSpawn : 1,
			ambiencesToSpawn : 5,
			spawnTunnels : true,
			spawnLength : 6500	,
			spawnThreshhold : 0.1,
			minSpawnDistance : 1500,
			leftBorder : -500,
			rightBorder : 500,
			leftEdge : -400,
			rightEdge : 400,
			type : "village",
			numberOfAmbiences : 27,
			itemsToSpawn:10,
		
			rampsToSpawn : 1,
		}
		this.worlds.push(world);
		var world = {
			enemiesToSpawn : 2,
			ambiencesToSpawn : 5,
			spawnTunnels : true,
			spawnLength : 7000,
			spawnThreshhold : 0.1,
			minSpawnDistance : 1500,
			leftBorder : -1000,
			rightBorder : 1000,
			leftEdge : -800,
			rightEdge : 800,
			type : "highway",
			numberOfAmbiences : 17,
			itemsToSpawn:15,
			rampsToSpawn : 2,
		}
		this.worlds.push(world);
		var world = {
			enemiesToSpawn : 3,
			ambiencesToSpawn : 4,
			spawnTunnels : true,
			spawnLength : 6500,
			spawnThreshhold : 0.5,
			minSpawnDistance : 1550,
			leftBorder : -800,
			rightBorder : 800,
			leftEdge : -600,
			rightEdge : 600,
			type : "city",
			numberOfAmbiences : 28,
			itemsToSpawn:15,
			rampsToSpawn : 2,
		}
		this.worlds.push(world);
		
		var world = {
			enemiesToSpawn : 2,
			ambiencesToSpawn : 10,
			spawnTunnels : false,
			spawnLength : 4600,
			spawnThreshhold : 0.1,
			minSpawnDistance : 2500,
			leftBorder : -800,
			rightBorder : 800,
			leftEdge : -600,
			rightEdge : 600,
			type : "beach",
			numberOfAmbiences : 16,
			itemsToSpawn:15,
			rampsToSpawn : 2,
		}
		this.worlds.push(world);
		
		var world = {
			enemiesToSpawn : 1,
			ambiencesToSpawn : 10,
			spawnTunnels : true,
			spawnLength : 5000,
			spawnThreshhold : 0.1,
			minSpawnDistance : 2000,
			leftBorder : -1000,
			rightBorder : 1000,
			leftEdge : -800,
			rightEdge : 800,
			type : "jungle",
			numberOfAmbiences : 20,
			itemsToSpawn:15,
			rampsToSpawn : 2,
		}
		this.worlds.push(world);
		
		
	}
	
	getWorldByType(name) {
		for (var i=0;i<this.worlds.length;i++) {
			if (this.worlds[i].type == name) {
				return this.worlds[i];
			}
			
		}
		
	}
	
	getWorld(number) {
		return this.worlds[number];
	}
	
	preloadSounds(world, callback) {
		so.resetQueuedInstance();
		var that = this;
		this.timeToLoad = performance.now();
		this.loadedCallback = callback;
		so.resetQueue();

		// 最優先：基本走行音
		so.enqueue("vehicles/landAsphalt");
		so.enqueue("vehicles/landDirt");
		so.enqueue("vehicles/tireAsphalt");
		so.enqueue("vehicles/tireDirt");
		so.enqueue("vehicles/wind");

		// バックグラウンドで順次読み込み
		for (var i = 0; i < this.worlds[world].numberOfAmbiences; i++) {
			so.enqueue("ambience/" + this.worlds[world].type + "/r" + (i + 1));
		}
		for (var i = 0; i < 38; i++) {
			so.enqueue("vehicles/npc/" + (i + 1));
		}
		for (var i = 0; i < 7; i++) {
			so.enqueue("crashes/bike" + (i + 1));
			so.enqueue("crashes/bump" + (i + 1));
		}
		for (var i = 0; i < 6; i++) {
			so.enqueue("crashes/bodyAsphalt" + (i + 1));
			so.enqueue("crashes/bodyDirt" + (i + 1));
			so.enqueue("crashes/bodyWater" + (i + 1));
		}
		so.enqueue("crashes/slideAsphalt");
		so.enqueue("crashes/slideDirt");
		so.enqueue("crashes/slideWater");
		so.enqueue("vehicles/rampJump");
		so.enqueue("vehicles/landNearWall");
		so.enqueue("vehicles/landWater");
		so.enqueue("vehicles/tireNearWall");
		so.enqueue("vehicles/tireWater");

		// バックグラウンドで並列読み込みを開始
		so.loadQueue(16);

		// プレイヤーを待たせずに即時レース開始！
		if (typeof callback === "function") {
			callback();
		}
	}
	progressCallback(progress) {
		// バックグラウンド読み込み時は音声を鳴らさず静かにロード
	}
	preLoadComplete() {
		so.setCallback(null);
		so.setQueueCallback(null);
		console.log("Background audio loaded in " + (performance.now() - this.timeToLoad) / 1000 + "s");
	}
}

export default WorldLoader;