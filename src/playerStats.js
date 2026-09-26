'use strict';
import GameInformation from './header';

class PlayerStats {
	constructor() {
		this.name = "Rider";
		this.numberOfGames = 0;
		this.numberOfCrashes = 0;
		this.numberOfCars = 0;
		this.numberOfJumps = 0;
		this.playTime = 0;
		this.airTime = 0;
		this.score = 0;
		this.gameScore = 0;
		this.travelDistance = 0;
		this.jumpHeight = 0;
		this.achievements = 0;
		this.coins = 0;
		this.unlockTunnels = 0;
		this.unlockBikes = [1];
		for (var i = 1; i < GameInformation.content.numberOfBikes; i++) {
			this.unlockBikes[i] = 0;
		}
		
		this.unlockTurnMode = 0;
		this.unlockFreeRun = 0;
		this.unlockAirGrip = 0;
		this.unlockWorlds = [1];
		for (var i = 1; i < GameInformation.content.numberOfWorlds; i++) {
			this.unlockWorlds[i] = 0;
		}
		this.unlockLethalWalls = 0;
		this.unlockRamps = 0;
		this.unlockShop = 0;
		this.firstTime = 1;
	}
}

export default PlayerStats;

