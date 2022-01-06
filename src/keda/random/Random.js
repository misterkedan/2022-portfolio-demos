class Random {

	/**
	 * Creates a wrapper for a PRNG, augmenting it with utility methods,
	 * for easy generation of integers, booleans etc.
	 *
	 * @param {*} prng		A pseudorandom number generator, ie Math.random
	 * or an Alea instance. It needs to implement a random() method returning
	 * a pseudorandom float between 0 and 1.
	 */
	constructor( prng = Math ) {

		this.prng = prng;

	}

	/**
	 * Returns a pseudorandom float between 0 and 1.
	 * Will be a 32-bit float if the prng is an Alea instance.
	 * Can vary depending on browsers ( 32-64 bits ) if the prng is Math.
	 *
	 * @returns {Number}	A pseudorandom float between 0 and 1.
	 */
	random() {

		return this.prng.random();

	}

	/**
	 * Alias for the random() method.
	 *
	 * @returns {Number}	A pseudorandom float between 0 and 1.
	 */
	amount() {

		return this.random();

	}

	/**
	 * Returns a pseudorandom number.
	 *
	 * @param 	{Number} 	min 		Minimum number ( inclusive ).
	 * @param 	{Number} 	max 		Maximum number ( inclusive ).
	 * @param 	{Boolean} 	rounded		Round the number before returning.
	 * @returns {Number} 	The pseudorandomly generated number.
	 */
	number( min = 0, max = 1, rounded = false ) {

		const random = this.random();

		if ( isNaN( min ) || isNaN( max ) ) return random;

		return ( rounded )
			?  Math.floor( random * ( max - min + 1 ) + min )
			: random * ( max - min ) + min;

	}

	/**
	 * Returns a float between -1 and 1.
	 *
	 * @returns {Number}	A float between 0 and 1
	 */
	noise() {

		return this.number( - 1, 1 );

	}

	/**
	 * Returns a pseudorandom integer.
	 *
	 * @param 	{Number}	min		Minimum number ( inclusive ).
	 * @param 	{Number}	max		Maximum number ( inclusive ).
	 * @returns {Number}	The pseudorandomly generated integer.
	 */
	int( min, max ) {

		return this.number( min, max, true );

	}

	/**
	 * Returns a pseudorandom unsigned integer.
	 *
	 * @param 	{Number}	max		Maximum number ( inclusive ).
	 * @returns {Number}	The pseudorandomly generated unsigned integer.
	 */
	uint( max ) {

		return this.int( 0, max );

	}

	/**
	 * Returns a pseudorandom boolean.
	 *
	 * @returns {Boolean}	The pseudorandomly generated boolean.
	 */
	boolean() {

		return ( this.random() < 0.5 );

	}

	/**
	 * Returns a pseudorandom boolean for a given probability.
	 *
	 * @param   {Number} 	probability		A probability between 0 and 1.
	 * @returns {Boolean}	The pseudorandomly generated boolean.
	 */
	chance( probability ) {

		return ( this.random() < probability );

	}

	/**
	 * Returns a pseudorandomly drawn item from an array.
	 *
	 * @param 	{Array}	array	The array to draw from.
	 * @returns {*}		The pseudorandomly drawn item.
	 */
	item( array ) {

		return array[ this.uint( array.length - 1 ) ];

	}

	/**
	 * Returns a pseudorandomly drawn character from an string.
	 *
	 * @param 	{String}	string	The string to draw from.
	 * @returns {String}	The pseudorandomly drawn character.
	 */
	char( string ) {

		return string.charAt( this.uint( string.length - 1 ) );

	}

}

export { Random };
