const CyberdarkSettings = {

	name: 'Cyberdark',

	background: {
		color1: '#060610',
		color2: '#262627',
	},

	depth: 50,

	particle: {
		color: '#323739',
		opacity: 0.6,
		size: 0.04,
		length: 5,

		count: 6000,

		bounds: {
			x: 30,
			y: 10,
		},

		noiseScale: 0.2,
		variance: 1.4,
	},

	speed: {
		value: 0.004,
	},

	bloom: {
		strength: 0.2,
		radius: 1,
		threshold: 0.2,
	},

	random: true,

};

export { CyberdarkSettings };
