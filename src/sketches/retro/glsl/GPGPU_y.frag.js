import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`

uniform float uTime;
uniform sampler2D GPGPU_startX;
uniform sampler2D GPGPU_startZ;
uniform sampler2D GPGPU_y;
${ FloatPack.glsl }
${ simplex3D }

void main() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	float x = unpackFloat( texture2D( GPGPU_startX, uv ) );
	float y = unpackFloat( texture2D( GPGPU_y, uv ) );
	float z = unpackFloat( texture2D( GPGPU_startZ, uv ) );

	y = simplex3D( x * 0.5, uTime * 0.0001, z * 0.04 ) * 0.8 
	+ simplex3D( uTime * 0.000001, x * 0.05, z * 0.0001 ) * 4.0;

	gl_FragColor = packFloat( y );

}

`;
