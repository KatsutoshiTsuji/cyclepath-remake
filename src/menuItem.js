"use strict";
import { TTS } from './tts';

if (typeof speech === "undefined") var speech = new TTS();

var MenuTypes = {
	NORMAL: 0,
	SELECTOR: 1,
	SLIDER: 2,
	EDIT: 3
};

class MenuItem {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.type = MenuTypes.NORMAL;
		this.element = document.createElement("button");
		this.element.type = "button";
		this.element.textContent = this.name;
		this.element.id = "menu_btn_" + this.id;
		this.element.className = "menu-item-button";
		this.element.setAttribute("aria-label", this.name);
		this.onFocusCallback = null;
		this.onClickCallback = null;
	}
	
	focus() {
		this.element.focus();
	}
	
	setCallbacks(focusCallback, clickCallback) {
		this.onFocusCallback = focusCallback;
		this.onClickCallback = clickCallback;
		this.element.onfocus = () => {
			if (typeof this.onFocusCallback === "function") this.onFocusCallback(this.id);
		};
		this.element.onclick = () => {
			if (typeof this.onClickCallback === "function") this.onClickCallback(this.id);
		};
	}
}

class SelectorItem {
	constructor(id, name, options, defaultOption = 0, changeCallback = null) {
		this.id = id;
		this.name = name;
		this.options = options;
		this.defaultOption = (typeof defaultOption === 'number' && defaultOption >= 0 && defaultOption < options.length) ? defaultOption : 0;
		this.currentOption = this.defaultOption;
		this.customChangeCallback = changeCallback;
		this.type = MenuTypes.SELECTOR;
		
		this.element = document.createElement("button");
		this.element.type = "button";
		this.element.id = "selector_btn_" + this.id;
		this.element.className = "menu-item-selector";
		this.updateLabel();
		
		this.onFocusCallback = null;
		this.onChangeCallback = null;
	}
	
	updateLabel() {
		var optText = this.options[this.currentOption] !== undefined ? this.options[this.currentOption] : "";
		var label = this.name + ": " + optText;
		this.element.textContent = label;
		this.element.setAttribute("aria-label", label);
	}
	
	focus() {
		this.element.focus();
	}
	
	nextOption() {
		if (this.currentOption < this.options.length - 1) {
			this.currentOption++;
		} else {
			this.currentOption = 0;
		}
		this.updateLabel();
		speech.speak(this.options[this.currentOption]);
		if (typeof this.customChangeCallback === "function") {
			this.customChangeCallback(this.currentOption);
		}
	}
	
	prevOption() {
		if (this.currentOption > 0) {
			this.currentOption--;
		} else {
			this.currentOption = this.options.length - 1;
		}
		this.updateLabel();
		speech.speak(this.options[this.currentOption]);
		if (typeof this.customChangeCallback === "function") {
			this.customChangeCallback(this.currentOption);
		}
	}
	
	setCallbacks(focusCallback, changeCallback) {
		this.onFocusCallback = focusCallback;
		this.onChangeCallback = changeCallback;
		this.element.onfocus = () => {
			if (typeof this.onFocusCallback === "function") this.onFocusCallback(this.id);
		};
		this.element.onclick = () => {
			this.nextOption();
			if (typeof this.onChangeCallback === "function") this.onChangeCallback(this.id);
		};
	}
}

class EditItem {
	constructor(id, name, defaultContents = "") {
		this.id = id;
		this.name = name;
		this.onChangeCallback = null;
		this.onFocusCallback = null;
		this.defaultContents = defaultContents;
		
		this.element = document.createElement("div");
		this.element.className = "menu-item-edit";
		this.label = document.createElement("label");
		this.label.textContent = this.name + ": ";
		this.label.setAttribute("for", "edit_" + this.id);
		
		this.input = document.createElement("input");
		this.input.id = "edit_" + this.id;
		this.input.value = this.defaultContents;
		
		this.element.appendChild(this.label);
		this.element.appendChild(this.input);
		this.type = MenuTypes.EDIT;
	}
	
	focus() {
		this.input.focus();
		speech.speak(this.name + (this.input.value ? ": " + this.input.value : ""));
	}
	
	setCallbacks(focusCallback, changeCallback) {
		this.onFocusCallback = focusCallback;
		this.onChangeCallback = changeCallback;
		this.input.onfocus = () => {
			speech.speak(this.name + (this.input.value ? ": " + this.input.value : ""));
			if (typeof this.onFocusCallback === "function") this.onFocusCallback(this.id);
		};
	}
}

class SliderItem {
	constructor(id, name, min = 0, max = 10, step = 1, defaultValue = 5) {
		this.id = id;
		this.name = name;
		this.minValue = min;
		this.maxValue = max;
		this.stepValue = step;
		this.defaultValue = defaultValue;
		this.onChangeCallback = null;
		this.onFocusCallback = null;
		
		this.element = document.createElement("div");
		this.element.className = "menu-item-slider";
		this.label = document.createElement("label");
		this.label.textContent = this.name + ": ";
		this.label.setAttribute("for", "slider_" + this.id);
		
		this.input = document.createElement("input");
		this.input.type = "range";
		this.input.min = this.minValue;
		this.input.max = this.maxValue;
		this.input.step = this.stepValue;
		this.input.value = this.defaultValue;
		this.input.id = "slider_" + this.id;
		
		this.element.appendChild(this.label);
		this.element.appendChild(this.input);
		this.type = MenuTypes.SLIDER;
	}
	
	focus() {
		this.input.focus();
		speech.speak(this.name + ": " + this.input.value);
	}
	
	setCallbacks(focusCallback, changeCallback) {
		this.onFocusCallback = focusCallback;
		this.onChangeCallback = changeCallback;
		this.input.onfocus = () => {
			speech.speak(this.name + ": " + this.input.value);
			if (typeof this.onFocusCallback === "function") this.onFocusCallback(this.id);
		};
		this.input.onchange = () => {
			speech.speak(this.name + ": " + this.input.value);
			if (typeof this.onChangeCallback === "function") this.onChangeCallback(this.id);
		};
	}
}

export { MenuItem, SelectorItem, EditItem, SliderItem, MenuTypes };