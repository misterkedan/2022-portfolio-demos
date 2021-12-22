vec3 linearGradient( 
	vec2 origin,
	vec2 target,
	vec3 color1,
	vec3 color2,
	float angle
) {

	float toTarget = length( target );
	angle = radians( angle ) + atan( target.y, target.x );

	float progressX = cos( angle ) * toTarget;
	float progressY = sin( angle ) * toTarget;
	vec2 progress = vec2( progressX, progressY ) + origin;

	return mix( color1, color2, smoothstep( 0.0, 1.0, progress.x ) );
	
}