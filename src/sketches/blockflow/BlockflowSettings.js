const tileSize = 0.4;
const tileMargin = tileSize * 0.1;

const BlockflowSettings = {

	title: 'Blockflow',

	background: {
		color1: 0x005a70,
		color2: 0x008558,
	},

	tile: {
		countX: 40,
		countZ: 40,

		width: tileSize,
		height: 0.05,
		depth: tileSize,

		margin: {
			x: tileMargin,
			y: 0,
			z: tileMargin
		},
	},

	material: {
		color: 0x00ff6e,
		opacity: 0.4,
		transparent: true,
	},

	cameraStart: { x: 10, y: 10, z: 10 },
	//cameraLookAt: { x:0, y: 0, z: 0 },
	cameraBounds: { x: 10, y: 20, z: 0 },

	bloom: {
		strength: 0.3,
		radius: 0.5,
		threshold: 0.4,
	},

	speed: {
		value: 0.0004,
	},

	gui: true,

	debug: true,

};

export { BlockflowSettings };
