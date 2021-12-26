const BlockflowSettings = {

	title: 'Blockflow',

	background: {
		//color1: 0x007aa3,
		//color2: 0x009440,
		color1: 0x005a70,
		color2: 0x008558,
	},

	tile: {
		countX: 40,
		countZ: 40,
		height: 0.05,
	},

	bounds: { x: 18, y: 18, z: 18 },

	material: {
		//color: 0xfff700,
		//color: 0xaaee00,
		color: 0x00ff6e,
		opacity: 0.45,
		transparent: true,
	},

	cameraStart: { x: 10, y: 10, z: 10 },
	//cameraLookAt: { x:0, y: 0, z: 0 },
	cameraBounds: { x: 10, y: 20, z: 0 },

	bloom: {
		strength: 0.32,
		radius: 0.5,
		threshold: 0.4,
	},

	speed: {
		value: 0.0004,
	},

	//gui: true,

	debug: true,

};

export { BlockflowSettings };
