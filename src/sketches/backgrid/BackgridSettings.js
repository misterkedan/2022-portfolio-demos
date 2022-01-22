const BackgridSettings = {

	name: 'Backgrid',

	// Sketch

	background: {
		color1: 0x080809,
		color2: 0x201f23,
	},
	colorInactive: 	0x222226,
	colorActive: 	0x3a4045,

	dot: {
		size: 0.038,
		margin: 0.14,
		rows: 128,
	},

	deltaScale: 0.002,
	timeScale: 0.0002,

	// Controls

	camera: {
		start: { x: 0, y: 0, z: 0 },
	},

	cursorProjector: {
		lerp: 0.007,
	},

	lerpSpeed: 0.048,
	depth: { min: 0.05, max: 0.15 },
	noiseScale: { min: 0.001, max: 4 },

};

export { BackgridSettings };
