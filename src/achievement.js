'use strict';
class AchievementProperty {
	constructor(name, condition, value) {
		this.name = name;
		this.condition = condition;
		this.value = value;
	}
	
	
}

class Achievement {
	constructor(id, name, displayName, propertiesToAchieve, properties) {
		this.name = name;
		
		this.properties = properties;
		
		this.propertiesToAchieve = propertiesToAchieve;
		
		
		this.displayName = displayName;
		this.unlocked = false;
		this.wasUnlocked = false;
		this.id = id;
		
	}
	
	checkPropertyValue(name) {
	
	
		switch(this.propertiesToAchieve[name].condition) {
			case 0:
				if (this.propertiesToAchieve[name].value == this.properties[name].value) {
					return true;
				} else return false;
			case -1:
				if (this.properties[name].value < this.propertiesToAchieve[name].value) {
					return true;
				} else return false;
			case 1:
				if (this.properties[name].value > this.propertiesToAchieve[name].value ) {
					return true;
				} else return false;
			default:
				return false;
		}
		
	}
	
	
	checkAllProperties() {
		var found=0;
		var length=0;
		for (var key in this.properties) {
			length++;
			
			if (this.checkPropertyValue(key, this.properties[key].value) == true) {
				found++;
				
			}
		}
		
		var returnObject = {
			unlocked:false,
			percentage:0,
			wasUnlocked:this.wasUnlocked,
			name:this.name,
			displayName:this.displayName,
			foundConditions:found,
			conditions:length
		}
		
		
		
		if (found == length) {
			if (this.wasUnlocked == false) returnObject.wasUnlocked = false;
			returnObject.unlocked = true;
			returnObject.percentage = 100;
			this.wasUnlocked = true;
			this.unlocked = true;
			returnObject.foundConitions = found;
			returnObject.conditions = length;
		} else {
			returnObject.unlocked = false;
			returnObject.percentage = (found/length)*100;
			returnObject.foundConitions = found;
			returnObject.conditions = length;
			this.wasUnlocked = false;
			returnObject.wasUnlocked = false;
		}
		
		return returnObject;
	}
	
}

class AchievementWatcher {
	constructor() {
		this.achievements = {};
	}
	
	addAchievement(id, name, displayName, propertiesToAchieve, properties) {
		if (properties === propertiesToAchieve) {
			
		}
		
		this.achievements[name] = new Achievement(id, name, displayName, propertiesToAchieve, properties);
		
		
	}
	updateAllAchievementValues(name, value) {
		for (var key in this.achievements) {
			if (typeof this.achievements[key].propertiesToAchieve[name] != 'undefined') {
				this.achievements[key].properties[name].value = value;
			}
		}
	}
	updateAchievementValue(name, key, value) {
		this.achievements[name].properties[key].value = value;
	}
	checkAchievementByName(name) {
		var achievement = this.achievements[name].checkAllProperties();
		return achievement;
		
		
	}
	
	checkAllAchievements() {
		var completedAchievements = new Array();
		var currentAchievement = 0;
		for (var key in this.achievements) {
			currentAchievement = this.achievements[key].checkAllProperties();
			
				completedAchievements.push(currentAchievement);
				
			
		}
		return completedAchievements;
	}
	checkUnlockedAchievements() {
		var completedAchievements = new Array();
		var currentAchievement = 0;
		for (var key in this.achievements) {
			currentAchievement = this.achievements[key].checkAllProperties();
			if (this.achievements[key].unlocked) {
				completedAchievements.push(currentAchievement);
			}
			
		}
		return completedAchievements;
	}
	
	checkLockedAchievements() {
		var completedAchievements = new Array();
		var currentAchievement = 0;
		for (var key in this.achievements) {
			currentAchievement = this.achievements[key].checkAllProperties();
			
			if (currentAchievement.wasUnlocked == false) {
				if (currentAchievement.unlocked) {
					completedAchievements.push(currentAchievement);
				
				}
			}
		}
		return completedAchievements;
	}
}

export default AchievementWatcher;