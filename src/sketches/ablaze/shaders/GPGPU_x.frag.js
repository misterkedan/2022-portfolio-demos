import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopValue from 'keda/glsl/loopValue.glsl';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`
precision highp float;

uniform sampler2D GPGPU_x;
uniform sampler2D GPGPU_y;
uniform sampler2D GPGPU_z;
uniform float uCurlScale;
uniform float uCurlSpeed;
uniform float uDelta;
uniform vec3 uBounds;
uniform vec2 uEpsilon;
${ FloatPack.glsl }
${ loopValue }
${ simplex3D }

void main() {
	
	// Read

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float x = unpackFloat( texture2D( GPGPU_x, uv ) );
	float y = unpackFloat( texture2D( GPGPU_y, uv ) );
	float z = unpackFloat( texture2D( GPGPU_z, uv ) );

	// Curl

	float epsilon = uEpsilon.x;
	float epsilon2 = uEpsilon.y;
	float scaledX = x * uCurlScale;
	float scaledY = y * uCurlScale;
	float scaledZ = z * uCurlScale;

	float noiseY1 = simplex3D( scaledX, scaledY + epsilon, scaledZ );
	float noiseY2 = simplex3D( scaledX, scaledY - epsilon, scaledZ );
	float averageY = ( noiseY1 - noiseY2 ) / epsilon2;

	float noiseZ1 = simplex3D( scaledX, scaledY, scaledZ + epsilon );
	float noiseZ2 = simplex3D( scaledX, scaledY, scaledZ - epsilon );
	float averageZ = ( noiseZ1 - noiseZ2 ) / epsilon2;

	float curlX = averageY - averageZ;

	// Write

	x = mix( x, x + curlX * uCurlSpeed, uDelta );
	x = loopValue( x, uBounds.x, uBounds.z );

	gl_FragColor = packFloat( x );

}
`;
