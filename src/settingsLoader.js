'use strict';
import AchievementLoader from './achievementsList';
import PlayerStats from './playerStats';
import GameInformation from './header';
import SettingsContainer from './settingsContainer';
import sono from 'sono';
import { setLanguage } from './i18n';
class SettingsLoader {
	constructor() {
		this.settings = null;
		this.playerStats = null;
		this.achievements = 0;
	}
	loadSettings() {
		if (window.localStorage != undefined) {
			var settings = localStorage.getItem("settings");
			
			if (settings != null) {
				this.settings = JSON.parse(settings);
				
			} else {
				this.settings = new SettingsContainer();
			}
			
			return this.settings;
		}
	}
	saveSettings(settings) {
		if (typeof window.localStorage != "undefined") {
			localStorage.setItem("settings", JSON.stringify(settings)); 
			this.settings = settings;
		}
	}
	
	loadStats() {
		if (typeof window.localStorage != "undefined") {
			var playerStats = localStorage.getItem("playerStats");
			
			if (playerStats != null) {
				this.playerStats = JSON.parse(playerStats);
			} else {
				this.playerStats = new PlayerStats();
			}
			this.saveStats(this.playerStats);
			return this.playerStats;
		}
	}
	
	saveStats(stats) {
		if (typeof window.localStorage != "undefined") {
			localStorage.setItem("playerStats", JSON.stringify(stats));
		}
	}
	
	loadAchievements() {
		if (typeof window.localStorage != "undefined") {
			var playerAchievements = localStorage.getItem("playerAchievements");
			
			if (playerAchievements != null) {
				this.playerAchievements = JSON.parse(playerAchievements);
				
			} else {
				
				var achievementLoader = new AchievementLoader();
				this.playerAchievements = achievementLoader.buildAchievements();
				
			}
			
			return this.playerAchievements;
		}
	}
	
	saveAchievements(achievements) {
		
		if (typeof window.localStorage != "undefined") {
			localStorage.setItem("playerAchievements", JSON.stringify(achievements));
		}
	}
	initializeSettings() {
		this.loadSettings();
		if (this.settings.language) {
			setLanguage(this.settings.language);
		}
		sono.panner.defaults.panningModel = this.settings.panningMode;
	}
	
	clearData() {
		localStorage.removeItem("playerStats");
		localStorage.removeItem("playerAchievements");
		localStorage.removeItem("settings");
	}
	
}

export default SettingsLoader;