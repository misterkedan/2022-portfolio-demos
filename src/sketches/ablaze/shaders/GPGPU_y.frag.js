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
uniform vec2 uEpsilon;
uniform vec3 uBounds;
uniform vec3 uWind;
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

	float noiseZ1 = simplex3D( scaledX, scaledY, scaledZ + epsilon );
	float noiseZ2 = simplex3D( scaledX, scaledY, scaledZ - epsilon );
	float averageZ = ( noiseZ1 - noiseZ2 ) / epsilon2;

	float noiseX1 = simplex3D( scaledX + epsilon, scaledY, scaledZ );
	float noiseX2 = simplex3D( scaledX - epsilon, scaledY, scaledZ );
	float averageX = ( noiseX1 - noiseX2 ) / epsilon2;

	float curlY = averageZ - averageX;

	// Write

	y = mix( y, y + curlY * uCurlSpeed + uWind.y, uDelta );
	y = loopValue( y, uBounds.x, uBounds.z );

	gl_FragColor = packFloat( y );

}
`;
