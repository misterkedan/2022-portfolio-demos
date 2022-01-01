mat3 rotateY( float angle ) {
	return mat3(
		vec3(   cos(angle),    0.0,           sin(angle)  ),
		vec3(   0.0,           1.0,           0.0         ),
		vec3(   -sin(angle),   0.0,           cos(angle)  )
	);
}