const offsetY = - 5;
const innerRadius = 0.6;

const RainSettings = {

	name: 'Rain II',

	random: true,

	// Scene

	instances: 700,
	offsetY,
	originZ: offsetY * 2,
	maxAngle: Math.PI * 2,
	ratio: 1.2,
	spread: 1.5,

	geometry: {
		innerRadius,
		outerRadius: innerRadius * 1.2,
		thetaSegments: 6
	},

	background: {
		color1: 0x26004d,
		color2: 0x0065d1,
	},

	material: {
		color: 0x62adfe,
		transparent: true,
	},

	bloom: {
		strength: 0.8,
		radius: 0.7,
		threshold: 0.33,
	},

	// Controls

	camera: {
		start: { x: 0, y: 10, z: 10 },
	},
	cameraRig: {
		speed: 0.0008,
		bounds: { x: 3, y: 10, z: 0 },
		intro: { x: 0, y: 4, z: 4 },
	},

	lerpSpeed: 0.001,
	opacity: { min: 0.7, max: 1 },
	speed: { min: 0.0002, max: 0.0004 },
	minCount: 100,

	// Targeted impacts

	instanceCount: 200,

	cursorProjector: {
		horizontal: true,
		cursorSize: 0.5,
		multiplier: 1.5,
	},

	targeted: {
		noise: 0.8,
		amplitude: 4,

		growth: 10,
		decay: 0.001,
		scale: { min: 0.1, max: 1.2 },
		delay: { min: 0.004, max: 1 },
	}

};

export { RainSettings };
