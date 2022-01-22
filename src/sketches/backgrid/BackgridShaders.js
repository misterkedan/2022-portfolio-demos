import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const BackgridShaders = {};

/*-----------------------------------------------------------------------------/

	GPGPU

/-----------------------------------------------------------------------------*/

BackgridShaders.GPGPU_intensity = /*glsl*/`
uniform sampler2D GPGPU_intensity;
uniform sampler2D GPGPU_offsetX;
uniform sampler2D GPGPU_offsetY;
uniform vec3 uCursor;
uniform float uDelta;
uniform float uNoiseScale;
uniform float uTime;

${ ShaderUtils.floatPack }
${ ShaderUtils.simplex3D }

	void main() {
	
	// Read

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float intensity = unpackFloat( texture2D( GPGPU_intensity, uv ) );

	float offsetX = unpackFloat( texture2D( GPGPU_offsetX, uv ) );
	float offsetY = unpackFloat( texture2D( GPGPU_offsetY, uv ) );
	vec3 offset = vec3( offsetX, offsetY, 0.0 );

	// Modify

	float simplex = simplex3D( 
		offsetX * uNoiseScale, 
		offsetY * uNoiseScale, 
		uTime
	);
	
	float waves = ( simplex + 1.0 ) * 5.0;
	
	float cursorReaction = ( 0.5 + abs( simplex ) ) * clamp(
		7.0 / ( length( uCursor - offset ) + 0.1 ),
		0.0,
		10.0
	);

	float targetIntensity = clamp( 
		( clamp( waves + cursorReaction, 0.0, 20.0 ) - 10.0 ) * 0.2,
		-1.0,
		1.0
	);

	intensity = mix( intensity, targetIntensity, uDelta );

	// Write

	gl_FragColor = packFloat( intensity );

}
`;

/*-----------------------------------------------------------------------------/

	Cores

/-----------------------------------------------------------------------------*/

BackgridShaders.cores = ShaderUtils.getBase();

BackgridShaders.cores.vertexShader = /*glsl*/`
attribute float aOffsetX;
attribute float aOffsetY;
attribute vec2 GPGPU_target;
uniform sampler2D GPGPU_intensity;
uniform float uDepth;
varying float vIntensity;
${ ShaderUtils.floatPack }

void main() {

	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = ( intensity + 1.0 ) / 2.0;

	vec3 transformed = position;
	transformed *= vIntensity;
	transformed += vec3( aOffsetX, aOffsetY, ( intensity - 1.0) * uDepth );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

BackgridShaders.cores.fragmentShader = /*glsl*/`
uniform vec3 uColorActive;
uniform vec3 uColorInactive;
varying float vIntensity;

void main() {

	vec3 dynamicColor = mix( uColorInactive, uColorActive, vIntensity );

	gl_FragColor = vec4( dynamicColor, 1.0 );

}
`;

/*-----------------------------------------------------------------------------/

	Shells

/-----------------------------------------------------------------------------*/

BackgridShaders.shells = ShaderUtils.getBase();

BackgridShaders.shells.vertexShader = /*glsl*/`
attribute float aOffsetX;
attribute float aOffsetY;
attribute vec2 GPGPU_target;
uniform sampler2D GPGPU_intensity;
uniform float uDepth;
varying float vIntensity;
${ ShaderUtils.floatPack }

void main() {

	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = ( intensity + 1.0 ) / 2.0;

	vec3 transformed = position;
	transformed *= vIntensity;
	transformed += vec3( aOffsetX, aOffsetY, vIntensity * uDepth );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

BackgridShaders.shells.fragmentShader = /*glsl*/`
uniform vec3 uColorActive;
uniform vec3 uColorInactive;
varying float vIntensity;

void main() {

	vec3 dynamicColor = mix( uColorInactive, uColorActive, vIntensity );

	gl_FragColor = vec4( dynamicColor, 1.0 );

}
`;

export { BackgridShaders };
