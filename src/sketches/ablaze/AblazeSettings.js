const AblazeSettings = {

	name: 'Ablaze',

	background: {
		color1: '#702000',
		color2: '#dd6000',
	},

	colorTop:  '#ffff99',
	material: {
		color: '#ff6600',
		opacity: 0.9,
		transparent: true,
	},

	particle: {
		count: 10000,
		size: 0.02,
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
		radius: 0.3,
		threshold: 0.1,
	},

	random: true,

};

export { AblazeSettings };
