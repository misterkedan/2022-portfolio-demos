const RetroSettings = {

	title: 'Retrogrid',

	background: {
		color1: 0x003e8f,
		color2: 0x680085,
		//color1: 0x26004d,
		//color2: 0x67344d,
	},

	bloom: {
		strength: 0.8,
		radius: 0.8,
		threshold: 0.25,
	},

	cameraStart: { x: 0, y: 0.2, z: 5 },
	cameraLookAt: { x: 0, y: 0, z: - 5 },
	cameraBounds: { x: 5, y: 10, z: 0 },
	cameraFar: 50,

	tilesX: 250,
	tilesZ: 170,

	material: {
		color: 0xff582e,
		opacity: 0.8,
		transparent: true,
	},

	speed: 0.16,

	gui: false,
	guiMinWidth: 1000,

	// Controls

	lerpSpeed: 0.01,
	noiseScaleX: { min: 0.01, max: 0.25 },
	noiseScaleY: { min: 0, max: 0.1 },
	amp: { min: 1, max: 2.5 },
	opacity: { min: 0.4, max: 0.8 },

};

export { RetroSettings };
