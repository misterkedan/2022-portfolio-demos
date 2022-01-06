import { Shaders } from 'keda/three/Shaders';

class BackgridShaders extends Shaders {}

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

	${ Shaders.floatPack }
	${ Shaders.simplex3D }

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

const coreVertexHead = /*glsl*/`
attribute float aOffsetX;
attribute float aOffsetY;
attribute vec2 GPGPU_target;
uniform sampler2D GPGPU_intensity;
uniform float uDepth;
varying float vIntensity;
${ Shaders.floatPack }
`;

const coreVertexBody = /*glsl*/`
	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = ( intensity + 1.0 ) / 2.0;
	transformed *= vIntensity;
	transformed += vec3( aOffsetX, aOffsetY, ( intensity - 1.0) * uDepth );
`;

const coreFragmentHead = /*glsl*/`
uniform vec3 uActiveColor;
varying float vIntensity;
`;

const coreFragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuseColor.rgb, uActiveColor, vIntensity );
`;

BackgridShaders.editCore = ( shader ) => Shaders.editBasic(
	shader,
	coreVertexHead,
	coreVertexBody,
	coreFragmentHead,
	coreFragmentBody
);

/*-----------------------------------------------------------------------------/

	Shells

/-----------------------------------------------------------------------------*/

const shellVertexHead = /*glsl*/`
attribute float aOffsetX;
attribute float aOffsetY;
attribute vec2 GPGPU_target;
uniform sampler2D GPGPU_intensity;
uniform float uDepth;
varying float vIntensity;
${ Shaders.floatPack }
`;

const shellVertexBody = /*glsl*/`
	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = ( intensity + 1.0 ) / 2.0;
	transformed *= vIntensity;
	transformed += vec3( aOffsetX, aOffsetY, vIntensity * uDepth );
`;

const shellFragmentHead = /*glsl*/`
uniform vec3 uActiveColor;
varying float vIntensity;
`;

const shellFragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuseColor.rgb, uActiveColor, vIntensity );
`;

BackgridShaders.editShell = ( shader ) => Shaders.editBasic(
	shader,
	shellVertexHead,
	shellVertexBody,
	shellFragmentHead,
	shellFragmentBody
);

export { BackgridShaders };
