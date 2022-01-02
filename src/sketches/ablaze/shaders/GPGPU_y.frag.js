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

	float noiseZ1 = simplex3D( scaledX, scaledY, scaledZ + uEpsilon );
	float noiseZ2 = simplex3D( scaledX, scaledY, scaledZ - uEpsilon );
	float noiseZ = noiseZ1 - noiseZ2;

	float noiseX1 = simplex3D( scaledX + uEpsilon, scaledY, scaledZ );
	float noiseX2 = simplex3D( scaledX - uEpsilon, scaledY, scaledZ );
	float noiseX = noiseX1 - noiseX2;

	float curl = ( noiseZ - noiseX ) * uCurlSpeed;

	// Write

	float noise = mix( uWind.y, curl, uCurlStrength.y ) + uWind.y;
	y = mix( y, y + noise, uDelta );
	y = loopValue( y, uBounds.x, uBounds.z );

	gl_FragColor = packFloat( y );

}
`;
