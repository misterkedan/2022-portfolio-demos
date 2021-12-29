import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopNumber from 'keda/glsl/loopNumber.glsl';

export default /*glsl*/`
uniform float uDelta;
uniform vec2 uBounds;
uniform sampler2D GPGPU_x;
${ FloatPack.glsl }
${ loopNumber }

void main() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float x = unpackFloat( texture2D( GPGPU_x, uv ) );

	x = loopNumber( x - uDelta * 3.0, uBounds.x, uBounds.y );

	gl_FragColor = packFloat( x );

}
`;
