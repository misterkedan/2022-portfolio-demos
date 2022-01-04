const BackgridSettings = {

	name: 'Backgrid',

	background: {
		color1: '#0a0a0a',
		color2: '#1c1c21',
	},

	activeColor: '#435056',
	material: {
		color: '#22222a',
		//opacity: 0.5,
		//transparent: true,
	},

	cameraStart: { x: 0, y: 0, z: 8 },
	//cameraLookAt: false,

	hitbox: {
		material: {
			color: '#ff0000',
			opacity: 0.25,
			transparent:true,
		},
	},

	cursor: {
		size: 0.1,
		material: {
			color: '#ff0000',
			wireframe: true
		},
		lerpSpeed: 0.01,
	},

};

export { BackgridSettings };
