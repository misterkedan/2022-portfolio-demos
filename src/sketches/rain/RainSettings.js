const offsetY = - 5;
const innerRadius = 0.6;

const RainSettings = {

	title: 'Rain II',

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
		radius: 0.5,
		threshold: 0.33,
	},

	// Controls

	gui: false,
	guiMinWidth: 1000,

	cameraBounds: { x: 3, y: 10, z: 0 },
	cameraIntro: { x: 0, y: 4, z: 4 },

	intensityLerpSpeed: 0.03,
	materialOpacity: { min: 0.6, max: 1 },
	bloomStrength: { min: 0.3, max:  0.8 },
	speed: { min: 0.003, max: 0.008 },
	minCount: 40,
	meshLerpSpeed: 0.015,

};

export { RainSettings };
