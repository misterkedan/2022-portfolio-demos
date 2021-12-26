const tileSize = 0.3;
const tileMargin = 0.025;

const BlockflowSettings = {

	title: 'Blockflow',

	background: {
		color1: 0x00996b,
		color2: 0x004241,
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
		color: 0x00ccbe,
		opacity: 0.4,
		transparent: true,
	},

	cameraStart: { x: 10, y: 5, z: 10 },
	//cameraLookAt: { x:0, y: 0, z: 0 },
	cameraBounds: { x: 10, y: 25, z: 0 },

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
