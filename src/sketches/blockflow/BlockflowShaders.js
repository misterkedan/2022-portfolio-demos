import { Shaders } from 'keda/three/Shaders';

class BlockflowShaders extends Shaders {}

/*-----------------------------------------------------------------------------/

	Main

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`
attribute vec3 aOffset;
uniform float uAmplitude;
uniform float uScale;
uniform float uTime;
uniform float uThickness;
uniform float uTurbulence;
uniform vec3 uCursor;
varying float vHeight;

${ Shaders.simplex3D }
`;

const vertexBody =  /*glsl*/`
	transformed += aOffset;

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
`;

const fragmentHead = /*glsl*/`
uniform vec3 uHighColor;
varying float vHeight;
`;

const fragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( diffuse, uHighColor, vHeight );
`;

BlockflowShaders.edit = ( shader ) => Shaders.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

export { BlockflowShaders };
