import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const BlockflowShader = ShaderUtils.getBase();

BlockflowShader.vertexShader = /*glsl*/`
attribute vec3 aOffset;
uniform float uAmplitude;
uniform float uScale;
uniform float uTime;
uniform float uThickness;
uniform float uTurbulence;
uniform vec3 uCursor;
varying float vHeight;

${ ShaderUtils.simplex3D }

void main() {

	vec3 transformed = position + aOffset;

	float distanceToCursor = length( uCursor - aOffset );
	float force = - 1.0 / ( 1.618 + sqrt( distanceToCursor ) );

	float waves = simplex3D(
		uScale * 0.02 * aOffset.x, 
		distanceToCursor * 0.1 - uTime,
		uScale * 0.02 * aOffset.z
	) * force * 8.0;

	float turbulence = simplex3D(
		aOffset.x * uScale,
		aOffset.z * uScale,
		uTime
	) * uTurbulence;

	float noise = abs( uThickness + waves + turbulence );

	transformed.y *= position.y * noise * uAmplitude;

	vHeight = transformed.y;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

BlockflowShader.fragmentShader = /*glsl*/`
uniform float opacity;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
varying float vHeight;

void main() {

	vec3 dynamicColor = mix( uColorLow, uColorHigh, vHeight );

	gl_FragColor = vec4( dynamicColor, opacity );

}
`;

export { BlockflowShader };
