import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`

uniform float uAmp;
uniform float uDistance;
uniform vec3 uNoiseScale;
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

	float noise = simplex3D( 
		x * uNoiseScale.x,
		mod( x, 2.0 ) *uNoiseScale.y,
		z * uNoiseScale.z
	);

	float largeNoise = uAmp * ( 
		simplex3D( x * 0.03, z * 0.03, uNoiseScale.x ) * 0.7 - 1.0
	);

	y = uAmp * ( clamp( noise * uAmp, -0.3, 0.3 ) + largeNoise );

	gl_FragColor = packFloat( y );

}

`;
