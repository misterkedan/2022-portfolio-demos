mat3 rotateX( float angle ) {
	return mat3(
		vec3(   1.0,	        0.0,             0.0	    ),
		vec3(   0.0, 	        cos(angle), 	-sin(angle) ),
		vec3(   0.0, 	        sin(angle), 	 cos(angle) )
	);
}