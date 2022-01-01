mat3 rotateZ( float angle ) {
	return mat3(
		vec3(   cos(angle),   -sin(angle),     0.0   ),
		vec3(   sin(angle),    cos(angle),     0.0   ),
		vec3(   0.0,           0.0,            1.0   )
	);
}