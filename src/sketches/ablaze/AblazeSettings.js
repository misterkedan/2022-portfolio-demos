const AblazeSettings = {

	name: 'Ablaze',

	background: {
		color1: 0xa8002a,
		color2: 0xdd5500,
	},
	colorHigh:	0xcc6600,
	colorLow:	0xffaa00,

	opacity: 0.9,

	particle: {
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
			color: 0xcc6600,
			opacity: 0.1,
			transparent: true,
		},
	},

	curl: {
		epsilon: 0.001,
		speed: 0.07,
		scale: 0.3,
		strength: {
			x: 0.5,
			y: 0.33,
			z: 0.5,
		},
	},

	rotation: 90,
	scale: {
		top: 0,
		bottom: 1,
		gradient: 0.5,
	},

	GPGPUTextureSize: 128,
	speed: 0.001,
	timeFactor: 0.03,
	lerpSpeed: 0.0015,

	bloom: {
		strength: 0.55,
		radius: 0.4,
		threshold: 0.455,
	},

	random: true,

};

export { AblazeSettings };
