import { Shaders } from 'keda/three/Shaders';

class NavscanShaders extends Shaders {}

/*-----------------------------------------------------------------------------/

	Main

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`
uniform float uAmp;
uniform float uDistance;
uniform vec3 uNoiseScale;

${ Shaders.simplex3D }
`;

const vertexBody =  /*glsl*/`
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
`;

NavscanShaders.edit = ( shader ) => Shaders.editBasic(
	shader, vertexHead, vertexBody
);

export { NavscanShaders };
