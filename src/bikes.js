'use strict';
class BikeLoader {
	constructor() {
		this.bikes = new Array();
		var bike = {}
		bike.maxSpeed = 8;
		bike.acceleration = 0.005;
		bike.turnSpeedFactor = 8;
		bike.gears = 4;
		bike.engineType = 5;
		bike.minRate = 0.8;
		bike.maxRate = 1.4;
		bike.engineSpeedFactor = 0.0018;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 11;
		bike.acceleration = 0.0075;
		bike.turnSpeedFactor = 12;
		bike.gears = 5;
		bike.engineType = 2;
		bike.minRate = 0.8;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0023;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 15;
		bike.acceleration = 0.01;
		bike.turnSpeedFactor = 10;
		bike.gears = 5;
		bike.engineType = 1;
		bike.minRate = 0.9;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0027;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 18;
		bike.acceleration = 0.02;
		bike.turnSpeedFactor = 18;
		bike.gears = 6;
		bike.engineType = 4;
		bike.minRate = 0.9;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0020;
		bike.maxAccelerate = 1;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 20;
		bike.acceleration = 0.025;
		bike.turnSpeedFactor = 14;
		bike.gears = 5;
		bike.engineType = 6;
		bike.minRate = 0.8;
		bike.maxRate = 1.2;
		bike.engineSpeedFactor = 0.0020;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 19;
		bike.acceleration = 0.0075;
		bike.turnSpeedFactor = 14;
		bike.gears = 5;
		bike.engineType = 7;
		bike.minRate = 0.8;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0023;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 22;
		bike.acceleration = 0.015;
		bike.turnSpeedFactor = 16;
		bike.gears = 5;
		bike.engineType = 8;
		bike.minRate = 0.95;
		bike.maxRate = 1.7;
		bike.engineSpeedFactor = 0.003;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 20;
		bike.acceleration = 0.023;
		bike.turnSpeedFactor = 16;
		bike.gears = 5;
		bike.engineType = 3;
		bike.minRate = 0.8;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0027;
		bike.maxAccelerate = 1;
		this.bikes.push(bike);
		
		var bike = {}
		bike.maxSpeed = 26;
		bike.acceleration = 0.035;
		bike.turnSpeedFactor = 16;
		bike.gears = 5;
		bike.engineType = 11;
		bike.minRate = 0.8;
		bike.maxRate = 1.5;
		bike.engineSpeedFactor = 0.0027;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		
		var bike = {}
		bike.maxSpeed = 17;
		bike.acceleration = 0.027;
		bike.turnSpeedFactor = 16;
		bike.gears = 5;
		bike.engineType = 10;
		bike.minRate = 0.8;
		bike.maxRate = 1.3;
		bike.engineSpeedFactor = 0.0025;
		bike.maxAccelerate = 1;
		this.bikes.push(bike);
		var bike = {}
		bike.maxSpeed = 21;
		bike.acceleration = 0.027;
		bike.turnSpeedFactor = 16;
		bike.gears = 7;
		bike.engineType = 9;
		bike.minRate = 0.8;
		bike.maxRate = 1.2;
		bike.engineSpeedFactor = 0.0027;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
		
		var bike = {}
		bike.maxSpeed = 18;
		bike.acceleration = 0.015;
		bike.turnSpeedFactor = 16;
		bike.gears = 4;
		bike.engineType = 12;
		bike.minRate = 0.8;
		bike.maxRate = 1.2;
		bike.engineSpeedFactor = 0.0027;
		bike.maxAccelerate = 1;
		this.bikes.push(bike);
		
		var bike = {}
		bike.maxSpeed = 23;
		bike.acceleration = 0.027;
		bike.turnSpeedFactor = 16;
		bike.gears = 5;
		bike.engineType = 13;
		bike.minRate = 0.8;
		bike.maxRate = 1.2;
		bike.engineSpeedFactor = 0.0032;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);

		// Bike 14: 1993 Suzuki VS 800 GL Intruder
		var bike = {};
		bike.maxSpeed = 22;
		bike.acceleration = 0.022;
		bike.turnSpeedFactor = 15;
		bike.gears = 5;
		bike.engineType = 14;
		bike.minRate = 0.85;
		bike.maxRate = 1.25;
		bike.engineSpeedFactor = 0.0028;
		bike.maxAccelerate = 2;
		this.bikes.push(bike);
	}
	getBike(number) {
		return this.bikes[number];
		
	}
}

export default BikeLoader;
