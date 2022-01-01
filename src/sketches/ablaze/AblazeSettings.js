const AblazeSettings = {

	name: 'Ablaze',

	background: {
		color1: '#aa0022',
		color2: '#dd5500',
	},

	particle: {
		colorTop:  '#cc6600',
		material: {
			color: '#ffaa00',
			opacity: 0.9,
			transparent: true,
		},
		count: 10000,
		size: 0.04,
		near: - 2,
		far: - 5,
	},

	disc: {
		size: 0.6,
		segments: 64,
		offset: - 1.5,
		fill: {
			color: 0,
			opacity: 0.05,
			transparent: true,
		},
		stroke: {
			opacity: 0.1,
		},
	},

	curl: {
		epsilon: 0.001,
		speed: 0.07,
		scale: 0.3,
	},

	GPGPUTextureSize: 128,
	speed: 0.001,
	timeFactor: 0.03,
	lerpSpeed: 0.0015,

	cameraStart: false,
	cameraLookAt: false,
	cameraRig: false,

	bloom: {
		strength: 0.4,
		radius: 0.4,
		threshold: 0.45,
	},

	random: true,

};

export { AblazeSettings };
