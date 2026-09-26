'use strict';
import $ from 'jquery'
import {KeyEvent} from './keycodes'
import {so } from './soundObject'
import {TTS,useWebTTS} from './tts'
if (typeof speech == "undefined") var speech = new TTS();
if (runningText == undefined) var runningText = 0;
class ScrollingText {
	constructor(text, delimiter="\n", callback=0) {
		let touchArea = document.getElementById("touchArea");
		touchArea.hidden = true;
		
		this.id = document.getElementById("interaction");
		this.id.hidden = false;
		this.container = document.createElement("div");
		this.textDiv = document.createElement("div");
		this.textDiv.innerHTML = "Meow";
		this.container.appendChild(this.textDiv);
		this.continueButton = document.createElement("input");
		this.continueButton.type = "button";
		this.continueButton.value = "Scroll";
		var that = this;
		this.continueButton.onclick = () => this.advance();
		this.container.appendChild(this.continueButton);
		this.id.appendChild(this.container);
		this.text = text;
		this.delimiter = delimiter;
		this.splitText = this.text.split(delimiter);
		this.currentLine=0;
		this.sndOpen = so.create("ui/textOpen");
		this.sndContinue = so.create("ui/textScroll");
		this.sndClose = so.create("ui/textClose");
		this.callback = callback;
		var id = document.getElementById("touchArea");
		//this.hammer = new Hammer(id);
		this.init();
	}
	init() {
		var that = this;
		runningText = this;

		

		this.sndOpen.play();
		this.currentLine = 0;
		this.readCurrentLine();
	}
	handleKeys(event) {
		switch(event.which) {
			case KeyEvent.DOM_VK_UP:
			case KeyEvent.DOM_VK_DOWN:
			case KeyEvent.DOM_VK_LEFT:
			case KeyEvent.DOM_VK_RIGHT:
				runningText.readCurrentLine();
				break;
			case KeyEvent.DOM_VK_RETURN:
				runningText.advance();
				break;
				
		}
	}
	
	handleTap(action) {
		if (action == 0) {
			this.readCurrentLine();
		}
		
		if (action == 1) {
			this.advance();
		}
		
	}
	
	readCurrentLine() {
		this.textDiv.innerHTML = this.splitText[this.currentLine];
	}
	advance() {
		if (this.currentLine < this.splitText.length-1) {
			this.currentLine++;
			this.sndContinue.play();
			this.readCurrentLine();
		} else {
			this.sndClose.play();
			let id = document.getElementById("touchArea");
			this.id.hidden = true;
			id.hidden = false;
//			this.hammer.destroy();
			if (this.callback!=0) this.callback();
			this.container.innerHTML = "";
		}
		
		
	}
}
export default ScrollingText;