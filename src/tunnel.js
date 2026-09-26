'use strict';
class Tunnel {
	constructor(z, type, depth) {
		this.z = z;
		this.type = type;
		this.depth = depth;
		this.toDestroy=false;
	}
	
	check(player) {
		return (player.z > this.z && player.z < this.z+this.depth)
	}
	destroy() {
		this.toDestroy=true;
	}
}

export default Tunnel;
