const offsetY = - 5;
const innerRadius = 0.6;

const RainSettings = {

	name: 'Rain II',

	// Scene

	cameraStart: { x: 0, y: 5, z: 10 },

	background: {
		color1: 0x26004d,
		color2: 0x0065d1,
	},

	instances: 2000,

	offsetY,
	originZ: offsetY * 2,
	maxAngle: Math.PI * 2,
	ratio: 1.2,

	geometry: {
		innerRadius,
		outerRadius: innerRadius * 1.2,
		thetaSegments: 6
	},

	material: {
		color: 0x62adfe,
		transparent: true,
	},

	bloom: {
		strength: 0.62,
		radius: 0.7,
		threshold: 0.33,
	},

	random: true,

	// Controls

	cameraBounds: { x: 3, y: 10, z: 0 },
	cameraIntro: { x: 0, y: 4, z: 4 },

	lerpSpeed: 0.001,
	opacity: { min: 0.5, max: 1 },
	bloomStrength: { min: 0.4, max: 0.8 },
	speed: { min: 0.0001, max: 0.0004 },
	minCount: 20,

};

export { RainSettings };
