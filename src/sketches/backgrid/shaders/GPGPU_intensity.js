import { FloatPack } from 'keda/three/gpgpu/FloatPack';

export default /*glsl*/`

	uniform sampler2D GPGPU_intensity;
	uniform sampler2D GPGPU_offsetX;
	uniform sampler2D GPGPU_offsetY;
	uniform vec3 uCursor;

	${ FloatPack.glsl }

	void main() {
	
	// Read

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float intensity = unpackFloat( texture2D( GPGPU_intensity, uv ) );

	float offsetX = unpackFloat( texture2D( GPGPU_offsetX, uv ) );
	float offsetY = unpackFloat( texture2D( GPGPU_offsetY, uv ) );
	vec3 offset = vec3( offsetX, offsetY, 0.0 );

	// Modify

	float targetIntensity = clamp(
		6.674 / ( length( uCursor - offset ) + 0.1 ),
		0.0,
		10.0
	) * 0.1;

	intensity = mix( intensity, targetIntensity, 0.07 );

	// Write

	gl_FragColor = packFloat( intensity );

}
`;
