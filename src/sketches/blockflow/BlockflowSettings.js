const tileSize = 0.3;
const tileMargin = 0.05;

const BlockflowSettings = {

	title: 'Blockflow',

	tile: {
		countX: 40,
		countZ: 40,

		width: tileSize,
		height: 0.1,
		depth: tileSize,

		margin: {
			x: tileMargin,
			y: 0,
			z: tileMargin
		},
	},

	border: 2.5 * ( tileSize + tileMargin ),

	background: {
		color1: '#0095b3',
		color2: '#008f5f',
	},

	uniforms: {
		amplitude: 200,
		scale: 0.5,
		thickness: 1,
		turbulence: 1,
		color: '#e1ff00',
	},

	material: {
		color: '#00c8d6',
		opacity: 0.5,
		transparent: true,
	},

	bloom: {
		strength: 0.23,
		radius: 0.5,
		threshold: 0.5,
	},

	cameraStart: { x: 10, y: 5, z: 10 },
	cameraBounds: { x: 10, y: 25, z: 0 },

	speed: {
		min: 1,
		max: 10,
		value: 3,
	},

	gui: true,
	//debug: true,

};

export { BlockflowSettings };
