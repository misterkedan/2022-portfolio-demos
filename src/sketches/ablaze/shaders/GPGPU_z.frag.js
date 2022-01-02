import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopValue from 'keda/glsl/loopValue.glsl';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`
uniform sampler2D GPGPU_x;
uniform sampler2D GPGPU_y;
uniform sampler2D GPGPU_z;
uniform float uCurlScale;
uniform float uCurlSpeed;
uniform float uDelta;
uniform float uEpsilon;
uniform vec3 uBounds;
uniform vec3 uCurlStrength;
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

	float scaledX = x * uCurlScale;
	float scaledY = y * uCurlScale;
	float scaledZ = z * uCurlScale;

	float noiseX1 = simplex3D( scaledX + uEpsilon, scaledY, scaledZ );
	float noiseX2 = simplex3D( scaledX - uEpsilon, scaledY, scaledZ );
	float noiseX = noiseX1 - noiseX2;

	float noiseY1 = simplex3D( scaledX, scaledY + uEpsilon, scaledZ );
	float noiseY2 = simplex3D( scaledX, scaledY - uEpsilon, scaledZ );
	float noiseY = noiseY1 - noiseY2;

	float curl = ( noiseX - noiseY ) * uCurlSpeed;

	// Write

	float noise = curl * uCurlStrength.z * uWind.z;
	z = mix( z, z + noise, uDelta );
	z = clamp( z, uBounds.x, uBounds.y );

	gl_FragColor = packFloat( z );

}
`;
