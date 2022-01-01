mat3 scale( float x, float y, float z ) {
	return mat3(
		vec3(   x,      0.0,    0.0   ),
		vec3(   0.0,    y,      0.0   ),
		vec3(   0.0,    0.0,    z     )
	);
}