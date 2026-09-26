import { KeyboardInput } from './input';
import GyroNorm from './gyronorm.complete';
import Hammer from 'hammerjs';
class UniversalInput {
	constructor() {
		this.keyboardInput = new KeyboardInput();
		this.gm = new GyroNorm();
		this.id = document.findElementById("gameArea");
		this.hammer = new Hammer.Manager(this.id);
		this.hammerTap = new Hammer.Tap();
		this.hammer.add(this.hammerTap);
		this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		this.actionLeft = null;
		this.actionRight = null;
		this.actionUp = null;
		this.actionDown = null;
		this.actionMain = null;
		this.tiltLeft = null;
		this.tiltRight = null;
		var that = this;
		this.keyboardInput.justPressedEventCallback = function(event) { that.handleKeyboard(event); });
		
	}
	handleKeyboard(event) {
		if (event == KeyEvent.DOM_VK_LEFT) {
			handleActionLeft();
		}
		
		if (event == KeyEvent.DOM_VK_RIGHT) {
			handleActionLeft();
		}
	}
	
	
}

export default UniversalInput;
