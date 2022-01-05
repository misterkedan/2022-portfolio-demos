const BackgridSettings = {

	name: 'Backgrid',

	// Sketch

	background: {
		color1: '#0a0a0a',
		color2: '#1c1c21',
	},
	activeColor: '#40484b',
	inactiveColor: '#22222a',

	dot: {
		size: 0.04,
		margin: 0.3,
		rows: 64,
	},

	deltaScale: 0.0025,
	timeScale: 0.0004,

	// Controls

	lerpSpeed: 0.05,
	depth: { min: 0.1, max: 0.5 },
	noiseScale: { min: 0.1, max: 1 },

	hitbox: {
		material: {
			color: '#ff0000',
			opacity: 0.25,
			transparent:true,
		},
	},
	cursor: {
		size: 0.1,
		material: {
			color: '#ff0000',
			wireframe: true
		},
		lerpSpeed: 0.01,
	},

	cameraStart: { x: 0, y: 0, z: 8 },

};

export { BackgridSettings };
