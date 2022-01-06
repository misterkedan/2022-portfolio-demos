const BackgridSettings = {

	name: 'Backgrid',

	// Sketch

	background: {
		color1: '#030303',
		color2: '#18181b',
	},
	inactiveColor: '#222226',
	activeColor: '#3a4045',

	dot: {
		size: 0.038,
		margin: 0.18,
		rows: 128,
	},

	deltaScale: 0.0025,
	timeScale: 0.0002,

	// Controls

	lerpSpeed: 0.048,
	depth: { min: 0.01, max: 0.1 },
	noiseScale: { min: 0.001, max: 3 },

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

	cameraStart: { x: 0, y: 0, z: 0 },

};

export { BackgridSettings };
