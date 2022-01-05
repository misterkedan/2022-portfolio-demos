const tileSize = 0.3;
const tileMargin = 0.05;

const BlockflowSettings = {

	name: 'Blockflow',

	// Scene

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
		color2: '#009966',
	},

	highColor: '#cbe600',
	material: {
		color: '#00c8d6',
		opacity: 0.5,
		transparent: true,
	},

	bloom: {
		strength: 0.2,
		radius: 0.7,
		threshold: 0.5,
	},

	// Controls

	cameraRigSpeed:  0.00075,
	cameraStart: { x: 10, y: 5, z: 10 },
	cameraBounds: { x: 8, y: 25, z: 0 },

	hitbox: {
		sizeMultiplier: 1.5,
		material: {
			color: '#ff0000',
			opacity: 0.25,
			transparent:true,
		},
	},
	cursor: {
		size: 1,
		material: {
			color: '#ff0000',
			wireframe: true
		},
		lerpSpeed: 0.007,
	},

	lerpSpeed: 0.0007,

	speed: 		{ min: 2.5, max: 3.5, value: 3 },
	amplitude: 	{ min: 150, max: 250, value: 200 },
	scale: 		{ min: 0.2, max: 0.8, value: 0.5 },
	thickness: 	{ min: 0.5, max: 1.5, value: 1 },
	turbulence: { min: 0.2, max: 1.5, value: 1 },
	opacity: { min: 0.4, max: 0.6 },

};

export { BlockflowSettings };
