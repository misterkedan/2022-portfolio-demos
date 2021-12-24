import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`

uniform float uDistance;
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

	z -= uDistance;

	float noise = simplex3D( x * 0.1, z * 0.05, mod( x, 2.0 ) * 0.08 );
	float largeNoise = simplex3D( x * 0.03, z * 0.03, 1.0 ) * 0.5;
	float targetY = 1.5 * ( clamp( noise, -0.3, 0.3 ) + largeNoise );
	y = targetY;
	//y = mix( -0.5, targetY, clamp( abs( pow( x, 5.0 ) ), 0.0, 1.0 ) );

	gl_FragColor = packFloat( y );

}

`;
