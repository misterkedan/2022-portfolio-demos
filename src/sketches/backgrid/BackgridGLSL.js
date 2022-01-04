import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import simplex3D from 'keda/glsl/simplex3D.glsl';
//import rotateX from 'keda/glsl/transform/rotateX.glsl';
//import rotateY from 'keda/glsl/transform/rotateY.glsl';
//import rotateZ from 'keda/glsl/transform/rotateZ.glsl';

const BackgridGLSL = {};

// GPGPU

BackgridGLSL.GPGPU_intensity = /*glsl*/`

	uniform sampler2D GPGPU_intensity;
	uniform sampler2D GPGPU_offsetX;
	uniform sampler2D GPGPU_offsetY;
	uniform vec3 uCursor;
	uniform float uDelta;
	uniform float uScale;
	uniform float uTime;

	${ FloatPack.glsl }
	${ simplex3D }

	void main() {
	
	// Read

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float intensity = unpackFloat( texture2D( GPGPU_intensity, uv ) );

	float offsetX = unpackFloat( texture2D( GPGPU_offsetX, uv ) );
	float offsetY = unpackFloat( texture2D( GPGPU_offsetY, uv ) );
	vec3 offset = vec3( offsetX, offsetY, 0.0 );

	// Modify

	float simplex = simplex3D( offsetX * uScale, offsetY * uScale, uTime );
	
	float waves = simplex;
	
	float cursorReaction = ( 1.0 + abs( simplex ) ) * clamp(
		6.674 / ( length( uCursor - offset ) + 0.1 ),
		0.0,
		10.0
	) * 0.2;

	float targetIntensity = waves + cursorReaction;

	intensity = mix( intensity, targetIntensity, uDelta );

	// Write

	gl_FragColor = packFloat( intensity );

}
`;

// Cores

BackgridGLSL.core = {};

BackgridGLSL.core.vertexHead = /*glsl*/`
attribute vec3 aOffset;
attribute vec2 GPGPU_target;
uniform sampler2D GPGPU_intensity;
varying float vIntensity;
${ FloatPack.glsl }
`;
BackgridGLSL.core.vertexBody = /*glsl*/`
	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = clamp( ( 1.0 + intensity ) * 0.25, 0.0, 1.0 );
	//transformed *= 0.8 + ( 1.0 - intensity ) * 0.2;
	transformed *= 0.2 + vIntensity;
	transformed += aOffset;
	transformed.z -= vIntensity * 0.3;
`;

BackgridGLSL.core.fragmentHead = /*glsl*/`
uniform vec3 uActiveColor;
varying float vIntensity;
`;
BackgridGLSL.core.fragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuseColor.rgb, uActiveColor, vIntensity );
`;

// Shells

BackgridGLSL.shell = {};

BackgridGLSL.shell.vertexHead = /*glsl*/`
	attribute vec3 aOffset;
	attribute vec2 GPGPU_target;
	uniform sampler2D GPGPU_intensity;
	varying float vIntensity;
	${ FloatPack.glsl }

`;
BackgridGLSL.shell.vertexBody = /*glsl*/`
	float intensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	vIntensity = clamp( ( 1.0 + intensity ) * 0.25, 0.0, 1.0 );
	transformed *= intensity * 0.2;
	transformed += aOffset;
	//transformed.z -= vIntensity * 0.2;
`;

BackgridGLSL.shell.fragmentHead = /*glsl*/`
	uniform vec3 uActiveColor;
	varying float vIntensity;
`;
BackgridGLSL.shell.fragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuseColor.rgb, uActiveColor, vIntensity );
`;


export { BackgridGLSL };
