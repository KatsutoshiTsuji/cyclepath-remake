'use strict';
import { MenuItem, EditItem, SelectorItem, SliderItem, MenuTypes } from './menuItem';
import { Menu } from './menu';
import { so } from './soundObject';
import ShopHandler from './shopHandler';
import GameInformation from './header';
import BikeLoader from './bikes';
import SettingsLoader from './settingsLoader';
import ScrollingText from './scrollingText';
import { t, setLanguage, getLanguage } from './i18n';

class MenuHandler {
	constructor() {
		this.currentMenu = null;
		this.firstTimeSetupIterator = 1;
		this.statsCallback = null;
		this.settingsCallback = null;
		this.playerStats = null;
		this.options = {
			bike: 0,
			world: 0,
			turnMode: 0
		};
		this.sndTransission = so.create("ui/menuTransission");
	}
	
	transissionMenu(callback) {
		so.playOnce("ui/menuTransission");
		if (typeof callback === "function") {
			setTimeout(callback, 80);
		}
	}

	firstTimeSetup(stats, callback) {
		this.statsCallback = callback;
		this.playerStats = stats;
		this.firstTimeSetupIterator = 1;
		this.advanceFirstTimeSetup(1);
	}

	advanceFirstTimeSetup(iterator = 1) {
		this.firstTimeSetupIterator = iterator;
		var that = this;
		
		if (this.firstTimeSetupIterator == 1) {
			var nameItem = new EditItem(1, "Name");
			var okItem = new MenuItem(2, "OK");
			this.currentMenu = new Menu("Please give me your name", [nameItem, okItem]);
			this.currentMenu.run(function(event) {
				that.currentMenu.destroy();
				that.setupName(event.items[0].value);
			});
		}
		if (this.firstTimeSetupIterator == 2) {
			new ScrollingText("Cool, " + this.playerStats.name + "\nWelcome to " + GameInformation.GAME_NAME + "!", "\n", function() { that.advanceFirstTimeSetup(3); });
		}
		if (this.firstTimeSetupIterator == 3) {
			var yesItem = new MenuItem(1, "Yes, give me a rundown");
			var noItem = new MenuItem(2, "No, I know how this works!");
			this.currentMenu = new Menu("Do you need a tutorial?", [yesItem, noItem]);
			this.currentMenu.run(function(event) {
				that.currentMenu.destroy();
				if (event.selected == 1) {
					that.advanceFirstTimeSetup(5);
				} else {
					that.advanceFirstTimeSetup(4);
				}
			});
		}
		if (this.firstTimeSetupIterator == 5) {
			new ScrollingText("This game is about driving a bike.\nYou're going down a straight path, avoiding cars and picking up coins.\nUse left and right arrows to steer, space to accelerate.\nHave fun!", "\n", function() { that.statsCallback(that.playerStats); });
		}
		if (this.firstTimeSetupIterator == 4) {
			new ScrollingText("OK, have fun unlocking stuff!", "\n", function() { that.statsCallback(that.playerStats); });
		}
	}

	setupName(name) {
		this.playerStats.name = name || "Rider";
		this.advanceFirstTimeSetup(2);
	}
	
	initWelcomeScreen(stats, callback = function() { return; }) {
		new ScrollingText("Hey, " + stats.name + "!\nYou start today with " + stats.coins + " coins.", "\n", callback);
	}
	
	initMainMenu(stats, callback) {
		var that = this;
		var items = [];
		items.push(new MenuItem(0, t("mainMenu.play")));
		items.push(new SelectorItem(1, t("mainMenu.achievements"), [t("mainMenu.unlocked"), t("mainMenu.all")]));
		items.push(new MenuItem(6, t("mainMenu.viewAchievements")));
		if (stats.unlockShop == true) { 
			items.push(new MenuItem(2, t("mainMenu.shop"))); 
		}
		items.push(new MenuItem(3, t("mainMenu.options")));
		items.push(new MenuItem(4, t("mainMenu.statistics")));
		items.push(new MenuItem(5, t("mainMenu.credits")));
		
		this.currentMenu = new Menu(t("mainMenu.title"), items);
		this.currentMenu.run(function(event) { 
			that.currentMenu.destroy(); 
			callback(event); 
		});
	}
	
	showStatistics(stats, callback) {
		var items = [];
		items.push(new MenuItem(0, t("stats.name") + ": " + stats.name));
		items.push(new MenuItem(1, t("stats.numberOfGames") + ": " + stats.numberOfGames));
		items.push(new MenuItem(2, t("stats.numberOfCars") + ": " + stats.numberOfCars));
		items.push(new MenuItem(3, t("stats.playTime") + ": " + Math.round(stats.playTime) + " " + t("stats.minutes")));
		items.push(new MenuItem(4, t("stats.totalScore") + ": " + Math.round(stats.score)));
		items.push(new MenuItem(5, t("stats.distance") + ": " + Math.round(stats.travelDistance / 100) + " " + t("stats.meters")));
		items.push(new MenuItem(6, t("stats.coins") + ": " + stats.coins));
		
		this.menu = new Menu(t("stats.title"), items);
		var that = this;
		this.menu.run(function() { 
			that.menu.destroy(); 
			callback(); 
		});
	}

	showCredits(callback) {
		var items = [];
		items.push(new MenuItem(0, t("creditsInfo.original")));
		items.push(new MenuItem(1, t("creditsInfo.license")));
		items.push(new MenuItem(2, t("creditsInfo.remake")));
		items.push(new MenuItem(3, t("creditsInfo.thanks")));
		items.push(new MenuItem(4, t("raceMenu.goBack")));

		this.menu = new Menu(t("creditsInfo.title"), items);
		var that = this;
		this.menu.run(function() {
			that.menu.destroy();
			callback();
		});
	}
	
	playBike(number) {
		if (typeof bikeLoader === "undefined") var bikeLoader = new BikeLoader();
		so.playOnce("vehicles/" + bikeLoader.getBike(number).engineType + "/preview");
	}
	
	initRaceMenu(stats, settings, callback, goBackCallback = 0) {
		var that = this;
		var menuItems = [];
		var bikesToAdd = [];
		var unlockedBikeIndices = [];
		
		for (var i = 0; i < GameInformation.content.numberOfBikes; i++) {
			if (stats.unlockBikes && stats.unlockBikes[i]) {
				unlockedBikeIndices.push(i);
				if (i === 13) {
					bikesToAdd.push("14 (Suzuki Intruder)");
				} else {
					bikesToAdd.push(String(i + 1));
				}
			}
		}
		if (unlockedBikeIndices.length === 0) {
			unlockedBikeIndices.push(0);
			bikesToAdd.push("1");
		}
		
		var lastBikePos = unlockedBikeIndices.indexOf(settings.lastBike || 0);
		if (lastBikePos === -1) lastBikePos = 0;
		
		var bikesItem = new SelectorItem(0, t("raceMenu.bike"), bikesToAdd, lastBikePos, function(idx) {
			that.playBike(unlockedBikeIndices[idx] || 0);
		});
		menuItems.push(bikesItem);
		
		var unlockedWorldIndices = [];
		var worldsToAdd = [];
		if (stats.unlockWorlds[0]) { unlockedWorldIndices.push(0); worldsToAdd.push(t("raceMenu.worlds.Farm")); }
		if (stats.unlockWorlds[4]) { unlockedWorldIndices.push(4); worldsToAdd.push(t("raceMenu.worlds.Highway")); }
		if (stats.unlockWorlds[1]) { unlockedWorldIndices.push(1); worldsToAdd.push(t("raceMenu.worlds.City")); }
		if (stats.unlockWorlds[2]) { unlockedWorldIndices.push(2); worldsToAdd.push(t("raceMenu.worlds.Beach")); }
		if (stats.unlockWorlds[3]) { unlockedWorldIndices.push(3); worldsToAdd.push(t("raceMenu.worlds.Jungle")); }
		
		if (unlockedWorldIndices.length === 0) {
			unlockedWorldIndices.push(0);
			worldsToAdd.push(t("raceMenu.worlds.Farm"));
		}
		
		var lastWorldPos = unlockedWorldIndices.indexOf(settings.lastWorld || 0);
		if (lastWorldPos === -1) lastWorldPos = 0;
		
		var worldsItem = new SelectorItem(1, t("raceMenu.world"), worldsToAdd, lastWorldPos);
		menuItems.push(worldsItem);
		
		var turnModes = stats.unlockTurnMode ? [t("raceMenu.turnModes.Classic"), t("raceMenu.turnModes.Modern")] : [t("raceMenu.turnModes.Classic")];
		var turnModeItem = new SelectorItem(2, t("raceMenu.turnMode"), turnModes, settings.lastTurnMode || 0);
		menuItems.push(turnModeItem);
		
		var rampsOptions = stats.unlockRamps ? [t("raceMenu.off"), t("raceMenu.on")] : [t("raceMenu.off")];
		var rampsItem = new SelectorItem(3, t("raceMenu.ramps"), rampsOptions, stats.unlockRamps ? (settings.lastRamps || 0) : 0);
		menuItems.push(rampsItem);
		
		var tunnelsOptions = stats.unlockTunnels ? [t("raceMenu.off"), t("raceMenu.on")] : [t("raceMenu.off")];
		var tunnelsItem = new SelectorItem(4, t("raceMenu.tunnels"), tunnelsOptions, stats.unlockTunnels ? (settings.lastTunnels || 0) : 0);
		menuItems.push(tunnelsItem);
		
		var freeRunOptions = stats.unlockFreeRun ? [
			t("raceMenu.freeRunModes.Off"),
			t("raceMenu.freeRunModes.Respawn"),
			t("raceMenu.freeRunModes.Invincible")
		] : [t("raceMenu.freeRunModes.Off")];
		var freeRunItem = new SelectorItem(5, t("raceMenu.freeRun"), freeRunOptions, stats.unlockFreeRun ? (settings.lastFreeRun || 0) : 0);
		menuItems.push(freeRunItem);
		
		var lethalWallsOptions = stats.unlockLethalWalls ? [t("raceMenu.off"), t("raceMenu.on")] : [t("raceMenu.off")];
		var lethalWallsItem = new SelectorItem(6, t("raceMenu.lethalWalls"), lethalWallsOptions, stats.unlockLethalWalls ? (settings.lastLethalWalls || 0) : 0);
		menuItems.push(lethalWallsItem);
		
		var startItem = new MenuItem(990, t("raceMenu.start"));
		menuItems.push(startItem);
		var goBackItem = new MenuItem(999, t("raceMenu.goBack"));
		menuItems.push(goBackItem);
		
		this.currentMenu = new Menu(t("raceMenu.title"), menuItems);
		this.currentMenu.run(function(event) { 
			if (event.selected == 999) {
				that.currentMenu.destroy();
				if (goBackCallback) goBackCallback();
				return;
			}
			var settingsLoader = new SettingsLoader();
			var chosenBike = unlockedBikeIndices[event.items[0].value] !== undefined ? unlockedBikeIndices[event.items[0].value] : 0;
			var chosenWorld = unlockedWorldIndices[event.items[1].value] !== undefined ? unlockedWorldIndices[event.items[1].value] : 0;
			
			settings.lastBike = chosenBike;
			settings.lastWorld = chosenWorld;
			settings.lastTurnMode = stats.unlockTurnMode ? event.items[2].value : 0;
			settings.lastRamps = stats.unlockRamps ? event.items[3].value : 0;
			settings.lastTunnels = stats.unlockTunnels ? event.items[4].value : 0;
			settings.lastFreeRun = stats.unlockFreeRun ? event.items[5].value : 0;
			settings.lastLethalWalls = stats.unlockLethalWalls ? event.items[6].value : 0;
			
			event.realBike = chosenBike;
			event.realWorld = chosenWorld;
			
			settingsLoader.saveSettings(settings);
			that.currentMenu.destroy(); 
			callback(event); 
		});
	}
	
	initOptionsMenu(settings, callback) {
		var that = this;
		var langPosition = (settings.language === 'en') ? 1 : 0;
		var langItem = new SelectorItem(0, t("options.language"), ["日本語", "English"], langPosition);

		var surroundPosition = (settings.panningMode === "HRTF") ? 0 : 1;
		var surroundItem = new SelectorItem(1, t("options.surround"), [t("raceMenu.on"), t("raceMenu.off")], surroundPosition);

		var effectsPosition = (settings.allowEffects == true) ? 0 : 1;
		var effectsItem = new SelectorItem(2, t("options.effects"), [t("raceMenu.on"), t("raceMenu.off")], effectsPosition);

		var gyroPosition = (settings.doGyro == true) ? 0 : 1;
		var gyroItem = new SelectorItem(3, t("options.gyro"), [t("raceMenu.on"), t("raceMenu.off")], gyroPosition);

		var webTTSPosition = (settings.webTTS == true) ? 0 : 1;
		var webTTSItem = new SelectorItem(4, t("options.webTTS"), [t("options.webTTSModes.on"), t("options.webTTSModes.off")], webTTSPosition);

		var saveItem = new MenuItem(5, t("options.save"));
		
		var optionsMenu = new Menu(t("options.title"), [langItem, surroundItem, effectsItem, gyroItem, webTTSItem, saveItem]);
		this.settingsCallback = callback;
		
		optionsMenu.run(function(event) { 
			var updatedSettings = {};
			updatedSettings.language = (event.items[0].value === 1) ? 'en' : 'ja';
			setLanguage(updatedSettings.language);

			if (event.items[1].value == 0) {
				updatedSettings.panningMode = "HRTF";
			} else {
				updatedSettings.panningMode = "equalpower";
			}
			updatedSettings.allowEffects = (event.items[2].value == 0);
			updatedSettings.doGyro = (event.items[3].value == 0);
			updatedSettings.webTTS = (event.items[4].value == 0);
			
			optionsMenu.destroy(); 
			that.settingsCallback(updatedSettings);
		}); 
	}
	
	initShop(stats, callback) {
		new ShopHandler(stats, callback);
	}
}

export default MenuHandler;