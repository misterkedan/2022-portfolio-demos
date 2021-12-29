float loopNumber( float number, float minimum, float change ) {

	return minimum + mod( number - minimum, change );

}