const BackgridSettings = {

	name: 'Backgrid',

	// Sketch

	background: {
		color1: '#080809',
		color2: '#201f23',
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

	camera: {
		start: { x: 0, y: 0, z: 0 },
	},

	cursorProjector: {
		lerp: 0.007,
	},

	lerpSpeed: 0.048,
	depth: { min: 0.01, max: 0.1 },
	noiseScale: { min: 0.001, max: 3 },

};

export { BackgridSettings };
