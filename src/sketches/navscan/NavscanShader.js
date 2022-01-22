import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

const NavscanShader = ShaderUtils.getBase();

NavscanShader.vertexShader = /*glsl*/`
uniform float uAmp;
uniform float uDistance;
uniform vec3 uNoiseScale;

${ ShaderUtils.simplex3D }

void main() {

	vec3 transformed = position;

	// Z
	transformed.z += mod( uDistance, 0.4 );

	// Y
	float x = position.x;
	float z = uDistance - transformed.z;
	float noise = simplex3D( 
		x * uNoiseScale.x,
		mod( x, 2.0 ) *uNoiseScale.y,
		z * uNoiseScale.z
	);

	float largeNoise = uAmp * (
		simplex3D( x * 0.03, z * 0.03, uNoiseScale.x ) * 0.7 - 1.0
	);

	transformed.y = uAmp * ( clamp( noise * uAmp, -0.3, 0.3 ) + largeNoise );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

NavscanShader.fragmentShader = /*glsl*/`
uniform vec3 color;
uniform float opacity;

void main() {

	gl_FragColor = vec4( color, opacity );

}
`;

export { NavscanShader };
