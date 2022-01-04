import { FloatPack } from 'keda/three/gpgpu/FloatPack';

const BackgridGLSL = {};

// GPGPU

BackgridGLSL.GPGPU_intensity = /*glsl*/`

	uniform sampler2D GPGPU_intensity;
	uniform sampler2D GPGPU_offsetX;
	uniform sampler2D GPGPU_offsetY;
	uniform vec3 uCursor;

	${ FloatPack.glsl }

	void main() {
	
	// Read

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float intensity = unpackFloat( texture2D( GPGPU_intensity, uv ) );

	float offsetX = unpackFloat( texture2D( GPGPU_offsetX, uv ) );
	float offsetY = unpackFloat( texture2D( GPGPU_offsetY, uv ) );
	vec3 offset = vec3( offsetX, offsetY, 0.0 );

	// Modify

	float targetIntensity = clamp(
		6.674 / ( length( uCursor - offset ) + 0.1 ),
		0.0,
		10.0
	) * 0.1;

	intensity = mix( intensity, targetIntensity, 0.07 );

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
	vIntensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	transformed *= 0.5 + vIntensity * 0.7;
	transformed += aOffset;
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
	vIntensity = unpackFloat( texture2D( GPGPU_intensity, GPGPU_target ) );
	transformed *= ( 1.0 + vIntensity * 3.0 ) ;
	transformed += aOffset;
`;

BackgridGLSL.shell.fragmentHead = /*glsl*/`
	uniform vec3 uActiveColor;
	varying float vIntensity;
`;
BackgridGLSL.shell.fragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuseColor.rgb, uActiveColor, vIntensity );
`;


export { BackgridGLSL };
