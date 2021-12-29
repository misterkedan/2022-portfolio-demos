import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopNumber from 'keda/glsl/loopNumber.glsl';

export default /*glsl*/`
uniform float uDelta;
uniform vec2 uBounds;
uniform sampler2D GPGPU_z;
${ FloatPack.glsl }
${ loopNumber }

void main() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float z = unpackFloat( texture2D( GPGPU_z, uv ) );

	//z = loopNumber( z - uDelta, uBounds.x, uBounds.y );

	gl_FragColor = packFloat( z );

}
`;
