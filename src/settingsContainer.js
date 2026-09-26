class SettingsContainer {
	constructor() {
		this.panningMode = "HRTF";
		this.allowEffects = true;
		this.lastBike = 0;
		this.lastFreeRun = 2; // Default to Invincible
		this.lastRamps = 0;
		this.lastTurnMode = 0;
		this.lastTunnels = 0;
		this.lastWorld = 0;
		this.lastLethalWalls = 0;
		this.doGyro = false;
		this.webTTS = false;
		this.language = "ja";
		this.showTwitter = false;
	}
}

export default SettingsContainer;
