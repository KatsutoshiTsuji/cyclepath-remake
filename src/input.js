'use strict';
import { KeyEvent } from './keycodes';

class KeyboardInput {
	constructor() {
		this.keyDown = [];
		this.justPressed = [];
		this.justReleased = [];
		this.justPressedEventCallback = null;
		this._onKeyDown = (e) => this.handleKeyDown(e);
		this._onKeyUp = (e) => this.handleKeyUp(e);
		this.initialized = false;
	}
	
	init() {
		if (this.initialized) return;
		this.reset();
		document.addEventListener("keydown", this._onKeyDown);
		document.addEventListener("keyup", this._onKeyUp);
		this.initialized = true;
	}

	destroy() {
		document.removeEventListener("keydown", this._onKeyDown);
		document.removeEventListener("keyup", this._onKeyUp);
		this.initialized = false;
		this.reset();
	}

	reset() {
		this.keyDown = [];
		this.justPressed = [];
		this.justReleased = [];
	}
	
	handleKeyDown(event) {
		// ゲームプレイに関係するキーのデフォルト動作（スクロールなど）を抑止
		if (event.which === KeyEvent.DOM_VK_SPACE || 
			event.which === KeyEvent.DOM_VK_LEFT || 
			event.which === KeyEvent.DOM_VK_RIGHT || 
			event.which === KeyEvent.DOM_VK_UP || 
			event.which === KeyEvent.DOM_VK_DOWN) {
			event.preventDefault();
		}

		if (this.keyDown[event.which] !== true) {
			this.keyDown[event.which] = true;
			this.justPressed[event.which] = true;
			this.justReleased[event.which] = false;
			if (typeof this.justPressedEventCallback === "function") {
				this.justPressedEventCallback(event.which);
			}
		}
	}
	
	handleKeyUp(event) {
		if (event.which === KeyEvent.DOM_VK_SPACE || 
			event.which === KeyEvent.DOM_VK_LEFT || 
			event.which === KeyEvent.DOM_VK_RIGHT || 
			event.which === KeyEvent.DOM_VK_UP || 
			event.which === KeyEvent.DOM_VK_DOWN) {
			event.preventDefault();
		}

		if (this.keyDown[event.which] === true) {
			this.keyDown[event.which] = false;
			this.justPressed[event.which] = false;
			this.justReleased[event.which] = true;
		}
	}
	
	isDown(event) {
		return !!this.keyDown[event];
	}

	isJustPressed(event) {
		if (this.justPressed[event] === true) {
			this.justPressed[event] = false;
			return true;
		}
		return false;
	}

	isJustReleased(event) {
		if (this.justReleased[event] === true) {
			this.justReleased[event] = false;
			return true;
		}
		return false;
	}
}

export { KeyboardInput };