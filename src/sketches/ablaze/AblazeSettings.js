const AblazeSettings = {

	name: 'Ablaze',

	background: {
		color1: '#aa0022',
		color2: '#dd5500',
	},

	colorTop:  '#cc6600',
	material: {
		color: '#ffaa00',
		opacity: 0.9,
		transparent: true,
	},

	particle: {
		count: 10000,
		size: 0.04,
		near: - 2,
		far: - 5,
	},

	curl: {
		epsilon: 0.001,
		speed: 0.14,
		scale: 0.3,
	},

	speed: 0.001,
	timeFactor: 0.03,

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
