const NavscanSettings = {

	name: 'Navscan',

	background: {
		color1: 0x003e8f,
		color2: 0x680085,
	},

	grid: {
		color: 0xff582e,
		opacity: 0.8,
		z: 10,
	},

	tiles: {
		x: 400,
		z: 200,
		width: 0.4,
		depth: 0.4,
	},

	camera: {
		start: { x: 0, y: 0, z: 5 },
		lookAt: { x: 0, y: 0, z: - 5 },
		intro: { x: 0, y: - 5, z: 5 },
	},

	cameraRig: {
		bounds: { x: 5, y: 10, z: 0 },
		speed: 0.0012,
	},

	bloom: {
		strength: 0.8,
		radius: 0.8,
		threshold: 0.25,
	},

	// Controls

	lerpSpeed: 0.0007,
	noiseScaleX: { min: 0.01, max: 0.25 },
	noiseScaleY: { min: 0, max: 0.1 },
	amp: { min: 1, max: 2.5 },
	opacity: { min: 0.4, max: 0.8 },
	speed: { min: 0.004, max: 0.012, value: 0.01 },

};

export { NavscanSettings };
