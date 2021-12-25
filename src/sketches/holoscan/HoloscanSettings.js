const HoloscanSettings = {

	title: 'Holoscan',

	tilesX: 400,
	tilesZ: 200,
	tileWidth: 0.4,
	tileDepth: 0.4,

	background: {
		color1: 0x003e8f,
		color2: 0x680085,
	},

	material: {
		color: 0xff582e,
		opacity: 0.8,
		transparent: true,
	},

	offsetZ: 10,
	cameraStart: { x: 0, y: 0, z: 5 },
	cameraLookAt: { x: 0, y: 0, z: - 5 },
	cameraBounds: { x: 5, y: 10, z: 0 },

	bloom: {
		strength: 0.8,
		radius: 0.8,
		threshold: 0.25,
	},

	// Controls

	gui: false,

	lerpSpeed: 0.01,
	noiseScaleX: { min: 0.01, max: 0.25 },
	noiseScaleY: { min: 0, max: 0.1 },
	amp: { min: 1, max: 2.5 },
	opacity: { min: 0.4, max: 0.8 },
	speed: { min: 0.005, max: 0.012, value: 0.01 },

};

export { HoloscanSettings };