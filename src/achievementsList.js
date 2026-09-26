'use strict';
class AchievementLoader {
	constructor() {
		this.achievements = new Array();
	}
	buildAchievements() {
		var achievement = {
			name:"secondBike",
			displayName:"Unlock second bike!",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":50,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		var achievement = {
			name:"unlockShop",
			displayName:"Unlock the store!",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":25,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		var achievement = {
			name:"firstTimer",
			displayName:"Obligatory achievement without doing anything, AKA you set things up!",
			id:1,
			properties:{
				firstTime:{"value":1}
			},
			propertiesToAchieve:{
				firstTime:{"value":0,"condition":0}
			}
		
		}
		this.achievements.push(achievement);
		
		
		var achievement = {
			name:"AThousandCars",
			displayName:"Clear a thousand cars!",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":1000,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		
		
		
		var achievement = {
			name:"ontoTheHighway",
			displayName:"You can now move to the highway!",
			id:1,
			properties:{
				travelDistance:{"value":0}
			},
			propertiesToAchieve:{
				travelDistance:{"value":100000,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		var achievement = {
			name:"intoTheCity",
			displayName:"You can now move to the city!",
			id:1,
			properties:{
				travelDistance:{"value":0}
			},
			propertiesToAchieve:{
				travelDistance:{"value":250000,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		var achievement = {
			name:"cityBike",
			displayName:"Want an appropriate bike to go with the look of the city?",
			id:1,
			properties:{
				travelDistance:{"value":0},
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				travelDistance:{"value":150000,"condition":1},
				numberOfCars:{"value":500,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		var achievement = {
			name:"gottaGoFast",
			displayName:"This bike isn't Sonic but sure feels like it",
			id:1,
			properties:{
				numberOfGames:{"value":0},
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfGames:{"value":100,"condition":1},
				numberOfCars:{"value":800,"condition":1}
			}
		
		}
		this.achievements.push(achievement);
		
		var achievement = {
			name:"stillDontHaveEnough",
			displayName:"This bike isn't Sonic but sure feels like it",
			id:1,
			properties:{
				playTime:{"value":0},
			},
			propertiesToAchieve:{
				playTime:{"value":60,"condition":1}
				
			}
		
		}
		this.achievements.push(achievement);
		
		
		var achievement = {
			name:"classicIsTooEasy",
			displayName:"Enable first person turning",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":200,"condition":1}
				
			}
		
		}
		this.achievements.push(achievement);
		var achievement = {
			name:"drivingIsBoring",
			displayName:"Unlock ramps to jump cars and get hella coins",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":512,"condition":1}
				
			}
		
		}
		this.achievements.push(achievement);
		var achievement = {
			name:"tunnelicious",
			displayName:"Unlock tunnels",
			id:1,
			properties:{
				numberOfCars:{"value":0}
			},
			propertiesToAchieve:{
				numberOfCars:{"value":768,"condition":1}
				
			}
		
		}
		this.achievements.push(achievement);
		
		return this.achievements;
	}
}

export default AchievementLoader;
