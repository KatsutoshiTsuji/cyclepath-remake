'use strict';
import { getLanguage } from './i18n';

var useWebTTS = true;

class TTS {
	constructor(webTTS = false) {
		this.synth = window.speechSynthesis;
		this.webTTS = webTTS;
	}
	
	speak(text) {
		if (!text) return;
		
		if (this.webTTS && this.synth) {
			var utterThis = new SpeechSynthesisUtterance(text);
			utterThis.lang = (getLanguage() === 'ja') ? 'ja-JP' : 'en-US';
			utterThis.rate = 1.0;
			if (typeof this.synth.stop !== 'undefined') {
				this.synth.stop();
			}
			this.synth.speak(utterThis);
		} else {
			var el = document.getElementById("speech");
			if (el) {
				el.innerHTML = "";
				var para = document.createElement("p");
				para.textContent = text;
				el.appendChild(para);
			}
		}
	}
	
	setWebTTS(tts) {
		this.webTTS = tts;
	}
}

if (typeof speech === "undefined") var speech = new TTS();
export { useWebTTS, TTS, speech };