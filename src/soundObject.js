import sono from 'sono';
import {panner} from 'sono/effects';

var isElectron = true;
var playOnceTimer;
class SoundObjectItem {
	constructor(file, callback = null, tag = 0) {
		this.fileName = file;
		this.callback = callback;
		this.loaded = false;
		this.tag = tag;
		this.data = null;
		
		try {
			this.sound = sono.create({
				src: file,
				onComplete: () => { this.doneLoading(); }
			});
			// セーフティタイムアウト（10秒）
			this.timeout = setTimeout(() => { this.doneLoading(); }, 10000);
		} catch (e) {
			this.doneLoading();
		}
	}
	
	doneLoading() {
		if (this.loaded) return;
		this.loaded = true;
		if (this.timeout) clearTimeout(this.timeout);
		if (this.sound && this.sound.data) this.data = this.sound.data;
		if (typeof this.callback === "function") {
			this.callback();
		}
	}
	play() {
		if (this.sound) this.sound.play();
	}
	destroy() {
		if (this.timeout) clearTimeout(this.timeout);
		if (this.sound) this.sound.destroy();
	}
}
class SoundObject {
	constructor() {
		this.sounds = new Array();
		this.loadingQueue = false;
		this.queueCallback = 0;
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		this.loadedCallback = 0;
		this.queue = new Array();
		this.queueLength = 0;
		this.totalQueueCount = 0;
		this.completedQueueCount = 0;
		this.statusCallback = null;
		
		var basePath = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : "./";
		if (!basePath.endsWith('/')) basePath += '/';
		if (sono.canPlay.opus) {
			this.directory = basePath + "soundsopus/";
			this.extension = ".opus";
		} else {
			this.directory = basePath + "soundsm4a/";
			this.extension = ".m4a";
		}
		
		this.oneShotSound = null;
	}
	setStatusCallback(callback) {
		this.statusCallback = callback;
	}
	findSound(file) {
		for (let i = 0; i < this.sounds.length; i++) {
			if (this.sounds[i] && this.sounds[i].fileName == file) {
				return this.sounds[i];
			}
		}
		return -1;
	}
	resetQueuedInstance() {
		for (let i = this.sounds.length - 1; i >= 0; i--) {
			if (typeof this.sounds[i] != "undefined") {
				if (this.sounds[i].tag == 1) {
					if (this.sounds[i].sound) this.sounds[i].sound.destroy();
					this.sounds.splice(i, 1);
				}
			}
		}
		
		this.loadingQueue = false;
		this.queueCallback = 0;
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		this.loadedCallback = 0;
		this.queue = new Array();
		this.queueLength = 0;
		this.totalQueueCount = 0;
		this.completedQueueCount = 0;
		this.statusCallback = null;
	}
	
	create(file) {
		file = this.directory + file + this.extension;
		let found = this.findSound(file);
		let returnObject = null;
		if (found == -1 || found.data == null) {
			returnObject = new SoundObjectItem(file, () => { this.doneLoading(); });
			this.sounds.push(returnObject);
			returnObject = returnObject.sound;
		} else {
			returnObject = sono.create("");
			returnObject.data = sono.utils.cloneBuffer(found.data);
		}
		return returnObject;
	}
	
	enqueue(file) {
		file = this.directory + file + this.extension;
		this.queue.push(file);
		this.queueLength = this.queue.length;
	}
	
	loadQueue(concurrency = 16) {
		this.loadingQueue = true;
		this.totalQueueCount = this.queue.length;
		this.completedQueueCount = 0;
		
		if (this.queue.length === 0) {
			this.loadingQueue = false;
			if (typeof this.queueCallback === "function") {
				this.queueCallback();
			}
			return;
		}

		var workers = Math.min(concurrency, this.queue.length);
		for (var i = 0; i < workers; i++) {
			this.processNextQueueItem();
		}
	}

	processNextQueueItem() {
		if (this.queue.length === 0) {
			if (this.completedQueueCount >= this.totalQueueCount) {
				this.loadingQueue = false;
				if (typeof this.queueCallback === "function") {
					this.queueCallback();
				}
			}
			return;
		}

		var file = this.queue.shift();
		if (this.findSound(file) !== -1) {
			this.completedQueueCount++;
			if (typeof this.statusCallback === "function") {
				this.statusCallback(this.completedQueueCount / this.totalQueueCount);
			}
			this.processNextQueueItem();
			return;
		}

		this.sounds.push(new SoundObjectItem(file, () => {
			this.completedQueueCount++;
			if (typeof this.statusCallback === "function") {
				this.statusCallback(this.completedQueueCount / this.totalQueueCount);
			}
			this.processNextQueueItem();
		}, 1));
	}

	setQueueCallback(callback) {
		this.queueCallback = callback;
	}
	resetQueue() {
		this.queue = new Array();
		this.loadingQueue = false;
		this.totalQueueCount = 0;
		this.completedQueueCount = 0;
	}
	
	setCallback(callback) {
		this.loadedCallback = callback;
	}
	doneLoading() {
		let result = this.isLoading();
		if (result == 1) {
			if (typeof this.loadedCallback === "function") {
				this.loadedCallback();
			}
		}
	}
	
	isLoading() {
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		for (let i = 0; i < this.sounds.length; i++) {
			if (typeof this.sounds[i] != "undefined") {
				if (this.sounds[i].loaded == false) {
					this.loadingSounds++;
				} else {
					this.loadedSounds++;
				}
			}
		}
		if (this.sounds.length === 0) return 1;
		return this.loadedSounds / this.sounds.length;
	}
	
	playOnce(file) {
		this.oneShotSound = this.create(file);
		this.oneShotSound.stop();
		this.oneShotSound.play();
		this.oneShotSound.on("ended", () => {
			if (this.oneShotSound.playing == false) this.oneShotSound.destroy();
		});
	}
}
let so = new SoundObject();
export { so }