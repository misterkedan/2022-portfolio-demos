import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopNumber from 'keda/glsl/loopNumber.glsl';

export default /*glsl*/`
uniform float uDelta;
uniform vec2 uBounds;
uniform sampler2D GPGPU_y;
${ FloatPack.glsl }
${ loopNumber }

void main() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float y = unpackFloat( texture2D( GPGPU_y, uv ) );

	y = loopNumber( y + uDelta, uBounds.x, uBounds.y );

	gl_FragColor = packFloat( y );

}
`;
