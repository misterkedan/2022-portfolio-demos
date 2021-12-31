const AblazeSettings = {

	name: 'Ablaze',

	background: {
		color1: '#dd2200',
		color2: '#eecc00',
	},

	material: {
		color: '#ffff99',
		opacity: 0.9,
		transparent: true,
	},

	particle: {
		count: 10000,
		size: 0.012,
		near: - 2,
		far: - 4,
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

	random: true,

};

export { AblazeSettings };
