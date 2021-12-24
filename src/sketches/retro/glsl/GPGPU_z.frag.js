import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`

uniform float uTime;
uniform sampler2D GPGPU_z;
${ FloatPack.glsl }
${ simplex3D }

void main() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float z = unpackFloat( texture2D( GPGPU_z, uv ) );

	z = fract( uTime * 2.0 / 5000.0 ) * 10.0;

	gl_FragColor = packFloat( z );

}

`;
