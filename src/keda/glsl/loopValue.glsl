float loopValue( float value, float minimum, float change ) {

	return minimum + mod( value - minimum, change );

}