export default {
	title: 'Retrogrid',

	background: {
		color1: 0x26004d,
		color2: 0x67344d,
	},

	bloom: {
		strength: 0.8,
		radius: 0.8,
		threshold: 0.3,
	},

	cameraStart: { x: 0, y: 0.2, z: 5 },
	cameraLookAt: { x: 0, y: 0, z: - 5 },
	cameraBounds: { x: 2, y: 10, z: 0 },

	tilesX: 250,
	tilesZ: 170,

	material: {
		color: 0x0099ff,
		opacity: 0.5,
		transparent: true,
	}

};
