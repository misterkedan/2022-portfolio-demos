import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

import GPGPU_x from './shaders/GPGPU_x.frag';
import GPGPU_y from './shaders/GPGPU_y.frag';
import GPGPU_z from './shaders/GPGPU_z.frag';

const AblazeShaders = {};

AblazeShaders.GPGPU_x = GPGPU_x;
AblazeShaders.GPGPU_y = GPGPU_y;
AblazeShaders.GPGPU_z = GPGPU_z;

AblazeShaders.material = ShaderUtils.getBase();
AblazeShaders.material.vertexShader = /*glsl*/`
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

${ ShaderUtils.rotateZ }
${ ShaderUtils.floatPack }

void main() {

	float translateX = unpackFloat( texture2D( GPGPU_x, GPGPU_target ) );
	float translateY = unpackFloat( texture2D( GPGPU_y, GPGPU_target ) );
	float translateZ = unpackFloat( texture2D( GPGPU_z, GPGPU_target ) );

	vAltitude = mix( 1.0, 0.0, ( translateY - uBounds.x ) / uBounds.z );
	
	float scale = mix( 
		uScale.x,
		uScale.y,
		vAltitude * mix( uScale.z, 1.0, aNoise )
	);

	vec3 transformed = position;
	transformed *= scale * rotateZ( uTime * uRotation * aNoise );
	transformed += vec3( translateX, translateY, translateZ );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

}
`;

AblazeShaders.material.fragmentShader = /*glsl*/`
uniform float opacity;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
varying float vAltitude;

void main() {

	vec3 dynamicColor = mix( uColorHigh, uColorLow, vAltitude );

	gl_FragColor = vec4( dynamicColor, opacity );

}
`;


export { AblazeShaders };
