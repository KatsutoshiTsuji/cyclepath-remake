'use strict';
import BikeLoader from './bikes';
class Shop {
	constructor(stats, purchaseCallback) {
		this.stats = stats;
		
		this.items = new Array();
		this.bikeLoader = new BikeLoader();
		this.purchaseCallback = purchaseCallback;
		this.handleID = 0;
		this.populateItems();
		
	}
	populateItems() {
		var bikes = new Array();
		var bike = {};
		bike.id = 0;
		bike.name = "Bike 4";
		bike.description = "This large bike lets you go relatively fast on the worlds most comfy seat which makes up 50% of its weight and 75% of its price";
		bike.price = 2000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 1;
		bike.name = "Bike 5";
		bike.description = "This bike is somewhere between Fast, economic, and sounding like it wants to scare other drivers away";
		bike.price = 2400;
		bikes.push(bike);
		
		
		var bike = {};
		bike.id = 2;
		bike.name = "Bike 6";
		bike.description = "An upgraded version of bike 3 that does just enough to make it a new generation";
		bike.price = 3000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 3;
		bike.name = "Bike 7";
		bike.description = "This bike Sacrifices comfort for pure speed, adrenaline, and a long ass exhaust that makes it roar like an angry lion";
		bike.price = 15000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 4;
		bike.name = "Bike 8";
		bike.description = "The first successful bike from Chonda. On paper it goes as fast and is better than its competition. In practice, while it does go fast its build quality makes it rather dangerous to do so while its engine makes sad, depressing wimpering sounds.";
		bike.price = 3000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 5;
		bike.name = "Muscle Car";
		bike.description = "This muscle car isn't even a bike, but it was sent to the wrong certification center and the examiners somehow didn't notice this fact.";
		bike.price = 6000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 6;
		bike.name = "A Frog on a Bike";
		bike.description = "Some people believe it was a bioengineering experiment gone wrong. Other blaim Russians and their experiments with materialising virtual animated characters in the real world. Who do you believe? It doesn't matter. It's a frog, on a bike, with glasses on and its private parts somewhat visible.";
		bike.price = 10000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 7;
		bike.name = "Spacebike";
		bike.description = "This spacebike was sent back in time after its previous owner accidentally flipped it into reverse while going at light speed, creating an interdimentional timerift.";
		bike.price = 8400;
		bikes.push(bike);
		
		
		var bike = {};
		bike.id = 8;
		bike.name = "E-Bike";
		bike.description = "In theory, this E-Bike is one of the first of its kind to be actually drivable...If the battery didn't die every 30 minutes";
		bike.price = 3000;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 9;
		bike.name = "Bike 13";
		bike.description = "Apparently, the people designing the engine for this thing weren't aware this was supposed to be a motorcycle, not a plane.";
		bike.price = 3500;
		bikes.push(bike);
		
		var bike = {};
		bike.id = 10;
		bike.name = "1993 Suzuki VS 800 GL Intruder";
		bike.description = "A powerful American-style V-Twin cruiser recorded directly from a real Suzuki Intruder. Smooth and roaring.";
		bike.price = 5000;
		bikes.push(bike);
		
		for (var i = 0;i<bikes.length;i++) {
			var id = parseInt(i);
			id += 3;
			
			var item ={
				id:bikes[i].id,
				name:bikes[i].name,
				description:bikes[i].description,
				price:bikes[i].price,
				
				sound:"vehicles/"+this.bikeLoader.getBike(id).engineType+"/preview"
			}
			this.items.push(item);
		}
		
		
		var worlds = new Array();
		var world = {
			id:100,
			name:"Beach",
			description:"A beautiful beach just waiting to be disturbed by your carelessness.",
			price:2000
		}
		worlds.push(world);
		
		var world = {
			id:101,
			name:"Jungle",
			description:"Originally, no motorbikes were allowed at this safari. You didn't care, and now you're here.",
			price:5000
		}
		worlds.push(world);
		
		for (var i=0;i<worlds.length;i++) {
			var item ={
				id:worlds[i].id,
				name:worlds[i].name,
				description:worlds[i].description,
				price:worlds[i].price,
				sound:0
			}
			this.items.push(item);
		}
		var item ={
			id:200,
			name:"Unlock Free Run",
			description:"Continue a game after dying",
			price:5000,
			sound:0
		}
		this.items.push(item);
		
		var item = {
			id:201,
			name:"Lethal Walls",
			description:"Turn on and off lethal walls",
			price:7000,
			sound:0
		}
		this.items.push(item);
		
		
	}
	purchaseItem(id) {
		this.handleID = id;
		
		if (!this.alreadyUnlockedItem(id)) {
			id = this.findItemByID(id);
			
		
			if (this.stats.coins >= this.items[id].price) {
				this.stats.coins -= this.items[id].price;
				this.unlockItem(this.handleID);
				this.purchaseCallback(true, this.stats);
			} else {
				this.purchaseCallback(false, this.stats);
			}
			
		} else {
			this.purchaseCallback(2, this.stats);
		
		}
	}
	
	
	alreadyUnlockedItem(id) {
		
		if (id < 100) {
			if (this.stats.unlockBikes[id+3] == 1) {
				
				return true;
			}
		}
		
		
		
		if (id < 200) {
			if (this.stats.unlockWorlds[id-100+2] == true) {
				
				return true;
			}
		}
		
		
		if (id == 200 && this.stats.unlockFreeRun == true) {
			
			return true;
		}
		
		if (id == 201 && this.stats.unlockLethalWalls == true) {
			
			return true;
		}
		return false;
	}
	
	findItemByID(id) {
		for (var i in this.items) {
			if (this.items[i].id == id) {
				return i;
			}
		}
	}
	
	unlockItem(id) {
		if (id < 100) {
			this.stats.unlockBikes[id+3] = true;
		}
		
		if (id < 200) {
			this.stats.unlockWorlds[id-100+2] = true;
		}
		if (id == 200) {
			this.stats.unlockFreeRun = true;
		}
		if (id == 201) {
			this.stats.unlockLethalWalls = true;
		}
		
	}
	
}

export default Shop;
