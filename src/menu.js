"use strict";
import $ from 'jquery';
import { TTS } from './tts';
if (typeof speech === "undefined") var speech = new TTS();

import { so } from './soundObject.js';
import { MenuTypes } from './menuItem';
import { KeyEvent } from './keycodes';

class Menu {
	constructor(name, menuData) {
		this.menuData = menuData;
		this.cursor = 0;
		this.oldSlideValue = 0;
		this.name = name;
		this.sndKeyChar = so.create("ui/keyChar");
		this.sndKeyDelete = so.create("ui/keyDelete");
		this.sndSliderLeft = so.create("ui/menuSliderLeft");
		this.sndSliderRight = so.create("ui/menuSliderRight");
		this.sndBoundary = so.create("ui/menuBoundary");
		this.sndChoose = so.create("ui/menuChoose");
		this.sndMove = so.create("ui/menuMove");
		this.sndOpen = so.create("ui/menuOpen");
		this.sndSelector = so.create("ui/menuSelector");
		this.sndWrap = so.create("ui/menuWrap");
		this.selectCallback = null;
		this.interactionElement = document.getElementById("interaction");
	}
	
	clickItem(id) {
		var idx = this.findCursorByID(id);
		if (idx !== -1) this.cursor = idx;
		this.select();
	}
	
	slideItem(id) {
		if (this.menuData[this.cursor].input.value < this.oldSlideValue) {
			this.decrease();
		} else {
			this.increase();
		}
		this.oldSlideValue = this.menuData[this.cursor].input.value;
	}
	
	focusItem(id) {
		this.sndMove.play();
		var idx = this.findCursorByID(id);
		if (idx !== -1) this.cursor = idx;
	}
	
	changeItem(id) {
		var idx = this.findCursorByID(id);
		if (idx !== -1) this.cursor = idx;
	}
	
	findCursorByID(id) {
		for (var i = 0; i < this.menuData.length; i++) {
			if (this.menuData[i].id == id) return i;
		}
		return -1;
	}
	
	nextItem() {
		if (this.cursor < this.menuData.length - 1) {
			this.cursor++;
		} else {
			this.cursor = 0;
			this.sndWrap.play();
		}
		this.sndMove.play();
		if (this.menuData[this.cursor]) this.menuData[this.cursor].focus();
	}

	previousItem() {
		if (this.cursor > 0) {
			this.cursor--;
		} else {
			this.cursor = this.menuData.length - 1;
			this.sndWrap.play();
		}
		this.sndMove.play();
		if (this.menuData[this.cursor]) this.menuData[this.cursor].focus();
	}
	
	increase() {
		if (this.menuData[this.cursor].type == MenuTypes.SLIDER) {
			this.sndSliderRight.play();
		} else if (this.menuData[this.cursor].type == MenuTypes.SELECTOR) {
			this.menuData[this.cursor].nextOption();
			this.sndSelector.play();
		}
	}
	
	decrease() {
		if (this.menuData[this.cursor].type == MenuTypes.SLIDER) {
			this.sndSliderLeft.play();
		} else if (this.menuData[this.cursor].type == MenuTypes.SELECTOR) {
			this.menuData[this.cursor].prevOption();
			this.sndSelector.play();
		}
	}
	
	destroySounds() {
		this.sndKeyChar.destroy();
		this.sndKeyDelete.destroy();
		this.sndSliderLeft.destroy();
		this.sndSliderRight.destroy();
		this.sndBoundary.destroy();
		this.sndChoose.destroy();
		this.sndMove.destroy();
		this.sndOpen.destroy();
		this.sndSelector.destroy();
		this.sndWrap.destroy();
	}

	destroy() {
		$(document).off("keydown.menu");
		if (this.interactionElement) this.interactionElement.innerHTML = '';
		window.focus();
		if (document.body) document.body.focus();
		var that = this;
		setTimeout(function() { that.destroySounds(); }, 500);
	}
	
	handleKeys(event) {
		switch (event.which) {
			case KeyEvent.DOM_VK_DOWN:
				event.preventDefault();
				this.nextItem();
				break;
			case KeyEvent.DOM_VK_UP:
				event.preventDefault();
				this.previousItem();
				break;
			case KeyEvent.DOM_VK_LEFT:
				event.preventDefault();
				this.decrease();
				break;
			case KeyEvent.DOM_VK_RIGHT:
				event.preventDefault();
				this.increase();
				break;
			case KeyEvent.DOM_VK_RETURN:
			case KeyEvent.DOM_VK_SPACE:
				if (this.menuData[this.cursor].type === MenuTypes.NORMAL) {
					event.preventDefault();
					this.select();
				} else if (this.menuData[this.cursor].type === MenuTypes.SELECTOR) {
					event.preventDefault();
					this.increase();
				}
				break;
		}
	}
		
	run(callback) {
		let touchArea = document.getElementById("touchArea");
		if (touchArea) touchArea.hidden = true;
		if (this.interactionElement) this.interactionElement.hidden = false;
		this.selectCallback = callback;
		var that = this;

		$(document).off("keydown.menu").on("keydown.menu", function(event) { that.handleKeys(event); });

		speech.speak(this.name);
		this.sndOpen.play();
		
		if (this.interactionElement) {
			this.interactionElement.innerHTML = '';
			let heading = document.createElement("h1");
			heading.textContent = this.name;
			this.interactionElement.appendChild(heading);
			
			for (var i = 0; i < this.menuData.length; i++) {
				if (this.menuData[i].type == MenuTypes.NORMAL) {
					this.menuData[i].setCallbacks((id) => that.focusItem(id), (id) => that.clickItem(id));
				}
				if (this.menuData[i].type == MenuTypes.SELECTOR) {
					this.menuData[i].setCallbacks((id) => that.focusItem(id), (id) => that.changeItem(id));
				}
				if (this.menuData[i].type == MenuTypes.SLIDER) {
					this.menuData[i].setCallbacks((id) => that.focusItem(id), (id) => that.slideItem(id));
				}
				this.interactionElement.appendChild(this.menuData[i].element);
			}
		}
		
		this.cursor = 0;
		if (this.menuData.length > 0) {
			setTimeout(() => {
				if (that.menuData[that.cursor]) that.menuData[that.cursor].focus();
			}, 100);
		}
	}
	
	select() {
		if (this.interactionElement) this.interactionElement.hidden = true;
		let touchArea = document.getElementById("touchArea");
		if (touchArea) touchArea.hidden = false;
		
		var selected = this.menuData[this.cursor] ? this.menuData[this.cursor].id : 0;
		var items = [];
		
		for (var i = 0; i < this.menuData.length; i++) {
			var addItem = null;
			if (this.menuData[i].type == MenuTypes.SLIDER || this.menuData[i].type == MenuTypes.EDIT) {
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].input ? this.menuData[i].input.value : 0
				};
			} else if (this.menuData[i].type == MenuTypes.SELECTOR) {
				var selID = this.menuData[i].currentOption !== undefined ? this.menuData[i].currentOption : 0;
				addItem = {
					id: this.menuData[i].id,
					value: selID,
					name: this.menuData[i].options[selID]
				};
			} else {
				addItem = {
					id: this.menuData[i].id,
					value: this.menuData[i].name
				};
			}
			items.push(addItem);
		}
		
		var toReturn = {
			selected: selected,
			cursor: this.cursor,
			items: items
		};
		
		this.sndChoose.play();
		if (typeof this.selectCallback === "function") {
			this.selectCallback(toReturn);
		}
	}
}

export { Menu };