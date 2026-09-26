var GameInformation = {
GAME_NAME: "Cyclepath",
GAME_VERSION: 0.1,
content:{
	numberOfBikes: 14,
	numberOfWorlds:5
},

isElectron: false
}

if (typeof process != "undefined") {
	GameInformation.isElectron=true;
}



export default GameInformation;
