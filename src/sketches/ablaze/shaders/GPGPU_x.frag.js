import { FloatPack } from 'keda/three/gpgpu/FloatPack';
import loopValue from 'keda/glsl/loopValue.glsl';
import simplex3D from 'keda/glsl/simplex3D.glsl';

export default /*glsl*/`
uniform sampler2D GPGPU_x;
uniform sampler2D GPGPU_y;
uniform sampler2D GPGPU_z;

uniform float uEpsilon;
uniform float uCurlScale;
uniform float uCurlSpeed;

uniform float uDelta;
uniform float uTime;

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

	float scaledX = ( x + uTime ) * uCurlScale;
	float scaledY = ( y + uTime ) * uCurlScale;
	float scaledZ = ( z + uTime ) * uCurlScale;

	float noiseY1 = simplex3D( scaledX, scaledY + uEpsilon, scaledZ );
	float noiseY2 = simplex3D( scaledX, scaledY - uEpsilon, scaledZ );
	float noiseY = noiseY1 - noiseY2;

	float noiseZ1 = simplex3D( scaledX, scaledY, scaledZ + uEpsilon );
	float noiseZ2 = simplex3D( scaledX, scaledY, scaledZ - uEpsilon );
	float noiseZ = noiseZ1 - noiseZ2;

	float curl = ( noiseY - noiseZ ) * uCurlSpeed;

	// Wind

	float wind =  uWind.x + simplex3D( uTime, uv.x * 0.1, uv.y * 0.1 );
	
	// Write

	float noise = mix( curl, wind, 0.3 ) + uWind.x;
	x = mix( x, x + noise, uDelta );
	x = loopValue( x, uBounds.x, uBounds.z );

	gl_FragColor = packFloat( x );

}
`;
