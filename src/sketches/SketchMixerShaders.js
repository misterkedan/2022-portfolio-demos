import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const SketchMixerShaders = {};

SketchMixerShaders.uniforms = {
	tMixA: 		{ value: null },
	tMixB: 		{ value: null },
	uCellsX: 	{ value: 30.0 },
	uCellsY: 	{ value: 100.0 },
	uDisplace: 	{ value: 0.2 },
	uMix:		{ value: 0.0 },
	uSeed:		{ value: 0.0 },
	uBackwards:	{ value: true },
	uAspect: 	{ value: 0.5 },
};

SketchMixerShaders.vertexShader = /*glsl*/`
	varying vec2 vUv;

	void main() {

		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	}
`;

SketchMixerShaders.fragmentShader = /*glsl*/`
uniform bool uBackwards;
uniform float uAspect;
uniform float uCellsX;
uniform float uCellsY;
uniform float uDisplace;
uniform float uMix;
uniform float uSeed;
uniform sampler2D tMixA;
uniform sampler2D tMixB;
varying vec2 vUv;

float random( float x, float y ) {

    vec2 st = vec2( x, y );

    return fract(
		sin( dot( st.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453123
	);

}

float perlin( float i, float j ) {

    i = floor( i );
    j = fract( j );
    float k = random( i, uSeed );
    float l = random( i + 1.0, uSeed );

    return mix( k, l, smoothstep( 0.0, 1.0, j ) );

}

${ ShaderUtils.parabola }

void main() {

	// Glitch

	vec2 cells = vec2( uCellsX, uCellsY );

	vec2 cellM = vUv * cells;
	vec2 cellXS = cellM * 10.000;
	vec2 cellS = cellM * 5.000;
	vec2 cellL = cellM * 0.5;
	vec2 cellXL = cellM * 0.1;

    float bands = perlin( 
		cellM.y + uMix, 
		cellM.y * 0.01
	);
	
	float smallBands = perlin( 
		cellL.x + random( cellXL.y, 100000.0 ) * 8.0 + uMix * perlin( cellXL.y, cellXL.y ) * 50.0, 
		cellXL.y * 0.001
	) * uMix * 0.5;

	float smallNoise = perlin(
		cellS.x + random( cellM.y, 10000000.0 ) + uMix * perlin( cellXS.y, cellXS.y ) * 1.0,
		cellM.y * 0.2
	) * uMix * 0.75;

	float glitch = parabola( uMix, 2.0 ) * ( bands - smallBands - smallNoise );

	// Displacement

	float displacement = parabola( vUv.x, 1.0 ) * glitch * uDisplace; 
	vec2 displacedUv = vec2( vUv.x + displacement, vUv.y );

	// Slanted mask
	
	float slant = 0.12 / uAspect;
	const float slantEase = 0.5;
	float offset = ( uBackwards ) 
		? slant * mix( 1.0, uMix, slantEase )
		: -slant * mix( 1.0, 1.0 - uMix, slantEase );
	offset *= ( 1.0 - vUv.y ) * parabola( uMix, 2.0 );
	float mask = step( 1.0 - vUv.x + offset, uMix );

	vec4 texelA = texture2D( tMixA, vec2( displacedUv.x + uMix * 0.2 * uAspect, displacedUv.y ) );
	vec4 texelB = texture2D( tMixB, displacedUv );

	float mixValue = clamp( mask + offset * displacement, 0.0, 1.0 );

	// Final mix

	gl_FragColor = mix( texelA, texelB, mixValue );

}
`;

export { SketchMixerShaders };
