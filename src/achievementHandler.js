import { MenuItem, EditItem, MenuTypes } from './menuItem';
import { Menu } from './menu';
import { so } from './soundObject';
import { TTS } from './tts';
if (typeof speech == 'undefined') var speech = new TTS();
'use strict';
class AchievementHandler {
	constructor(achievementWatcher) {
		
		this.achievementWatcher = achievementWatcher;
		
		this.menu = null;
	}
	
	showAchievements(mode=0, callback) {
		var achievementMenuItems = new Array();
		if (mode==1) {
			var achievements = this.achievementWatcher.checkAllAchievements();
		} else {
			var achievements = this.achievementWatcher.checkUnlockedAchievements();
		}
		
		var count=0;
		
		
		for (var key in achievements) {
			achievementMenuItems.push(new MenuItem(count, achievements[key].displayName + ", " + achievements[key].foundConditions + " of " + achievements[key].conditions + " cleared"));
			count++;
		}
		this.menu = new Menu("Achievements", achievementMenuItems);
		var that = this;
		if (callback == undefined) {
			callback = function(event) {
				
			}
		}
		this.menu.run(function(event) { that.menu.destroy(); callback(event); });
	}
	
	checkLockedAchievements(speak=false) {
		var achievements = this.achievementWatcher.checkLockedAchievements();
		
		if (achievements.length > 0) {
			so.playOnce("ui/achievementUnlocked");
			for (var key in achievements) {
				if (speak==true) speech.speak("Achievement unlocked!" + achievements[key].displayName)
			}
		}
	}
	
	updateAchievementValue(name, key, value) {
		this.achievementWatcher.updateAchievementValue(name, key, value);
	}
	
	updateAllAchievementValues(name, value) {
		this.achievementWatcher.updateAllAchievementValues(name, value);
	}
	
	updateAllValues(stats) {
		this.updateAllAchievementValues("numberOfGames", stats.numberOfGames);
		this.updateAllAchievementValues("numberOfCrashes", stats.numberOfCrashes);
		this.updateAllAchievementValues("numberOfCars", stats.numberOfCars);
		this.updateAllAchievementValues("numberOfJumps", stats.numberOfJumps);
		this.updateAllAchievementValues("playTime", stats.playTime);
		this.updateAllAchievementValues("airTime", stats.airTime);
		this.updateAllAchievementValues("score", stats.score);
		this.updateAllAchievementValues("travelDistance", stats.travelDistance);
		this.updateAllAchievementValues("jumpHeight", stats.jumpHeight);
		this.updateAllAchievementValues("coins", stats.coins);
		this.updateAllAchievementValues("firstTime", stats.firstTime);
	}
	
	syncStats(stats) {
		var achievement = this.achievementWatcher.checkAchievementByName("unlockShop");
		if (achievement.unlocked == true) {
			stats.unlockShop = true;
		}
		
		var achievement = this.achievementWatcher.checkAchievementByName("secondBike");
		if (achievement.unlocked == true) {
			stats.unlockBikes[1] = true;
		}
		
		
		var achievement = this.achievementWatcher.checkAchievementByName("cityBike");
		if (achievement.unlocked == true) {
			stats.unlockBikes[2] = true;
		}
		var achievement = this.achievementWatcher.checkAchievementByName("gottaGoFast");
		if (achievement.unlocked == true) {
			stats.unlockBikes[3] = true;
		}
		var achievement = this.achievementWatcher.checkAchievementByName("stillDontHaveEnough");
		if (achievement.unlocked == true) {
			stats.unlockBikes[4] = true;
		}
		var achievement = this.achievementWatcher.checkAchievementByName("classicIsTooEasy");
		if (achievement.unlocked == true) {
			stats.unlockTurnMode = true;
		}
		var achievement = this.achievementWatcher.checkAchievementByName("ontoTheHighway");
		if (achievement.unlocked == true) {
			stats.unlockWorlds[4] = true;
		}
		
		var achievement = this.achievementWatcher.checkAchievementByName("intoTheCity");
		if (achievement.unlocked == true) {
			stats.unlockWorlds[1] = true;
		}
		
		var achievement = this.achievementWatcher.checkAchievementByName("drivingIsBoring");
		if (achievement.unlocked == true) {
			stats.unlockRamps = true;
		}
		var achievement = this.achievementWatcher.checkAchievementByName("tunnelicious");
		if (achievement.unlocked == true) {
			
			stats.unlockTunnels = true;
		}
		/*
		var achievement = this.achievementWatcher.checkAchievementByName("unlockLake");
		if (achievement.unlocked == true) {
			stats.unlockWorlds[2] = true;
		}
		
		*/
		return stats;
	}
	printAchievements() {
		
		
		
		
	}
	
}

export default AchievementHandler;