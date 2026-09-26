'use strict';
import SettingsLoader from './settingsLoader.js';
import World from './world';
import WorldLoader from './worlds';
import BikeLoader from './bikes';
import MenuHandler from './menuHandler';
import AchievementLoader from './achievementsList';
import AchievementWatcher from './achievement';
import AchievementHandler from './achievementHandler';
import Player from './player.js';
import ScrollingText from './scrollingText';
import { TTS } from './tts';
import { t, setLanguage } from './i18n';

if (typeof speech == 'undefined') var speech = new TTS();
class Game {
	constructor() {
		this.world = null;
		this.lastWorld = null;
		this.settingsLoader = new SettingsLoader();
		this.worldLoader = new WorldLoader();
		this.bikeLoader = new BikeLoader();
		this.playerStats = null;
		this.playerAchievements = null;
		this.tutorialHandler = null;
		this.settings = null;
		this.inGame = false;
		this.menuHandler = new MenuHandler();
		this.achievementWatcher = null;
		this.achievementLoader = new AchievementLoader()
		this.achievementHandler = null;
	}
	
	checkAchievements() {
		var that = this;
		this.achievementHandler.updateAllValues(this.playerStats);
		this.achievementHandler.checkLockedAchievements();
		// this.achievementHandler.showAchievements();
	}
	initGame() {
		this.achievementWatcher = new AchievementWatcher();
		var achievements = this.settingsLoader.loadAchievements();
		
		for (var key in achievements) {
			
			this.achievementWatcher.addAchievement(achievements[key].id, achievements[key].name, achievements[key].displayName, achievements[key].propertiesToAchieve, achievements[key].properties);
		}
		this.achievementHandler = new AchievementHandler(this.achievementWatcher);
		
		var cb = this;
		this.playerStats = this.settingsLoader.loadStats();
		this.settings = this.settingsLoader.loadSettings();
		this.settingsLoader.initializeSettings();
		 speech.setWebTTS(this.settings.webTTS);
		if (this.playerStats.firstTime) {
			
			this.menuHandler.firstTimeSetup(this.playerStats, function(stats) { cb.firstTimeCallback(stats); });
		} else {
			this.menuHandler.initWelcomeScreen(this.playerStats, function() { cb.initMainMenu(); });
		}
	}
	firstTimeCallback(name) {
		this.playerStats.name = name.name;
		
		this.playerStats.firstTime = 0;
		
		this.settingsLoader.saveStats(this.playerStats);
		this.preMenu();
		var that = this;
		this.menuHandler.transissionMenu(function() { that.initMainMenu(); });
	}
	
	preMenu() {
		this.checkAchievements();
		this.playerStats = this.achievementHandler.syncStats(this.playerStats);
	}
	initMainMenu() {
		
		this.preMenu();
		
		var cb = this;
		
		this.menuHandler.initMainMenu(this.playerStats, function(event) { cb.selectMenu(event); });
		
	}
	selectMenu(event) {
		var that = this;

		switch(event.selected) {
			case 0:
				var cb = this;
				
				this.menuHandler.transissionMenu(function() { 
					cb.menuHandler.initRaceMenu(cb.playerStats, cb.settings, function(event) { 
						cb.startWorld(event);
					}, function() { cb.initMainMenu(); }) });
				break;
			case 6:
				// this.initAchievementsMenu();
				this.menuHandler.transissionMenu(function() { that.achievementHandler.showAchievements(event.items[1].value, function() { that.initMainMenu(); });});
				break;
			case 2:
				this.menuHandler.transissionMenu(function() { that.menuHandler.initShop(that.playerStats, function(stats) { that.playerStats = stats; that.initMainMenu(); });});
				break;
			case 3:
				this.menuHandler.initOptionsMenu(this.settings, function(settings) { that.settings = settings; that.settingsLoader.saveSettings(settings); that.settingsLoader.initializeSettings(); that.initMainMenu(); });
				break;
			case 4:
				this.menuHandler.transissionMenu(function() { that.menuHandler.showStatistics(that.playerStats, function() { that.initMainMenu(); });});
				break;
			case 5:
				this.menuHandler.transissionMenu(function() { that.menuHandler.showCredits(function() { that.initMainMenu(); });});
				break;
		}
	}
	
	startWorld(event) {
		var bikeIndex = (event.realBike !== undefined) ? event.realBike : (event.items[0] && typeof event.items[0].value === 'number' ? event.items[0].value : 0);
		var bike = new BikeLoader().getBike(bikeIndex);
		
		var worldLoader = new WorldLoader();
		var worldIndex = (event.realWorld !== undefined) ? event.realWorld : (event.items[1] && typeof event.items[1].value === 'number' ? event.items[1].value : 0);
		
		var freeRunMode = event.items[5] ? event.items[5].value : 0; // 0: Off, 1: Respawn, 2: Invincible
		var options = {
			spawnTunnels: event.items[4] ? event.items[4].value : 0,
			spawnRamps: event.items[3] ? event.items[3].value : 0,
			turnMode: event.items[2] ? event.items[2].value : 0,
			allowEffects: this.settings.allowEffects,
			canRespawn: freeRunMode >= 1,
			invincible: freeRunMode === 2,
			lethalWalls: freeRunMode === 2 ? false : (event.items[6] ? !event.items[6].value : true),
			doGyro: this.settings.doGyro
		};
		
		speech.speak(t("game.loading"));
		var that = this;
		if (typeof this.lastWorld == null || this.lastWorld != worldIndex) {
			worldLoader.preloadSounds(worldIndex, function() { that.initWorld(worldIndex, bike, worldLoader, options); });
		} else {
			this.initWorld(worldIndex, bike, worldLoader, options);
		}
	}
	
	initWorld(id, bike, world, options, achievementWatcher) {
		this.lastWorld = id;
		var player = new Player(bike, options.turnMode, options.canRespawn, null, options.invincible);
		world = world.getWorld(id);
		world.allowEffects = this.settings.allowEffects;
		
		window.focus();
		if (document.body) document.body.focus();

		var that = this;
		this.world = new World(player, world, options, this.achievementHandler, this.playerStats, function(event) { that.showScore(event); });
		this.world.player.init();
		
		window.requestAnimationFrame(function() { that.update(); });
	}
	
	showScore(gameStats) {
		var that = this;
		var resultText = t("game.result", {
			distance: Math.round(gameStats.travelDistance / 100),
			score: Math.round(gameStats.score),
			level: Math.round(gameStats.level),
			coins: gameStats.collectedCoins
		});
		new ScrollingText(resultText, "\n", function() { that.world.destroy(); that.initMainMenu(); });
	}
	update() {
		
		
		this.world.tick();
		
	}
	
}

export default Game;