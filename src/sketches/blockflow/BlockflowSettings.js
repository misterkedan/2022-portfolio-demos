const tileSize = 0.3;
const tileMargin = 0.025;

const BlockflowSettings = {

	title: 'Blockflow',

	background: {
		color1: 0x005e75,
		color2: 0x008f5f,
	},

	tile: {
		countX: 40,
		countZ: 40,

		width: tileSize,
		height: 0.01,
		depth: tileSize,

		margin: {
			x: tileMargin,
			y: 0,
			z: tileMargin
		},
	},

	material: {
		color: 0x00ff6e,
		opacity: 0.38,
		transparent: true,
	},

	cameraStart: { x: 10, y: 10, z: 10 },
	//cameraLookAt: { x:0, y: 0, z: 0 },
	cameraBounds: { x: 10, y: 20, z: 0 },

	bloom: {
		strength: 0.5,
		radius: 0.5,
		threshold: 0.5,
	},

	speed: {
		value: 0.00025,
	},

	//gui: true,
	debug: true,

};

export { BlockflowSettings };
