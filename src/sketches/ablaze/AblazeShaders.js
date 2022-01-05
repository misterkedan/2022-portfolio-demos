import { Shaders } from 'keda/three/Shaders';

import GPGPU_x from './shaders/GPGPU_x.frag';
import GPGPU_y from './shaders/GPGPU_y.frag';
import GPGPU_z from './shaders/GPGPU_z.frag';

class AblazeShaders extends Shaders {}

AblazeShaders.GPGPU_x = GPGPU_x;
AblazeShaders.GPGPU_y = GPGPU_y;
AblazeShaders.GPGPU_z = GPGPU_z;

/*-----------------------------------------------------------------------------/

	Main

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`
attribute float aNoise;
attribute vec2 GPGPU_target;
uniform float uRotation;
uniform float uTime;
uniform sampler2D GPGPU_x;
uniform sampler2D GPGPU_y;
uniform sampler2D GPGPU_z;
uniform vec3 uBounds;
uniform vec3 uScale;
varying float vAltitude;

${ Shaders.rotateZ }
${ Shaders.floatPack }
`;

const vertexBody =  /*glsl*/`
	float translateX = unpackFloat( texture2D( GPGPU_x, GPGPU_target ) );
	float translateY = unpackFloat( texture2D( GPGPU_y, GPGPU_target ) );
	float translateZ = unpackFloat( texture2D( GPGPU_z, GPGPU_target ) );

	vAltitude = mix( 1.0, 0.0, ( translateY - uBounds.x ) / uBounds.z );
	
	float scale = mix( 
		uScale.x,
		uScale.y,
		vAltitude * mix( uScale.z, 1.0, aNoise )
	);

	transformed *= scale * rotateZ( uTime * uRotation * aNoise );
	transformed += vec3( translateX, translateY, translateZ );
`;

const fragmentHead = /*glsl*/`
uniform vec3 uColorTop;
varying float vAltitude;
`;

const fragmentBody = /*glsl*/`
	diffuseColor.rgb = mix( uColorTop, diffuse, vAltitude );
`;

AblazeShaders.edit = ( shader ) => Shaders.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

export { AblazeShaders };
