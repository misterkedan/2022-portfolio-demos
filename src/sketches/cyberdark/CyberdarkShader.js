import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const CyberdarkShader = ShaderUtils.getBase();

CyberdarkShader.vertexShader = /*glsl*/`
attribute float aSpeed;
attribute vec3 aOffset;
uniform float uDepth;
uniform float uTraveled;
varying float vIntensity;

${ ShaderUtils.parabola }

void main() {

	vec3 offset = aOffset;
	offset.z = mod( offset.z + uTraveled * aSpeed, uDepth );

	float progress = offset.z / uDepth;
	vIntensity = pow( progress, 2.0 );

	float scale = mix( progress, parabola( progress, 2.0 ), 0.8 );

	vec3 transformed = position * scale + offset;
	transformed.z *= aSpeed * 1.5;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

CyberdarkShader.fragmentShader =  /*glsl*/`
uniform vec3 color;
uniform float opacity;
varying float vIntensity;

void main() {

	vec3 dynamicColor = color;
	float dynamicOpacity = opacity * vIntensity;

	gl_FragColor = vec4( dynamicColor, opacity );

}
`;

export { CyberdarkShader };
