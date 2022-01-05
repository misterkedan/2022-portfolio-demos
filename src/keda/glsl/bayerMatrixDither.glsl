vec3 bayerMatrixDither( vec3 color ) {

	int index = int( mod( gl_FragCoord.x - 0.5, 8.0 ) ) + 
		int( mod( gl_FragCoord.y - 0.5, 8.0 ) * 8.0 );

	float bayerValue = 0.0;

	// Silly code because gl

	bayerValue = ( index == 1 ) ? 32.0 : bayerValue;
	bayerValue = ( index == 2 ) ?  8.0 : bayerValue;
	bayerValue = ( index == 3 ) ? 40.0 : bayerValue;
	bayerValue = ( index == 4 ) ?  2.0 : bayerValue;
	bayerValue = ( index == 5 ) ? 34.0 : bayerValue;
	bayerValue = ( index == 6 ) ? 10.0 : bayerValue;
	bayerValue = ( index == 7 ) ? 42.0 : bayerValue;

	bayerValue = ( index == 8 ) ? 48.0 : bayerValue;
	bayerValue = ( index == 9 ) ? 16.0 : bayerValue;
	bayerValue = ( index == 10 ) ? 56.0 : bayerValue;
	bayerValue = ( index == 11 ) ? 24.0 : bayerValue;
	bayerValue = ( index == 12 ) ? 50.0 : bayerValue;
	bayerValue = ( index == 13 ) ? 18.0 : bayerValue;
	bayerValue = ( index == 14 ) ? 58.0 : bayerValue;
	bayerValue = ( index == 15 ) ? 26.0 : bayerValue;

	bayerValue = ( index == 16 ) ? 12.0 : bayerValue;
	bayerValue = ( index == 17 ) ? 44.0 : bayerValue;
	bayerValue = ( index == 18 ) ?  4.0 : bayerValue;
	bayerValue = ( index == 19 ) ? 36.0 : bayerValue;
	bayerValue = ( index == 20 ) ? 14.0 : bayerValue;
	bayerValue = ( index == 21 ) ? 46.0 : bayerValue;
	bayerValue = ( index == 22 ) ?  6.0 : bayerValue;
	bayerValue = ( index == 23 ) ? 38.0 : bayerValue;

	bayerValue = ( index == 24 ) ? 60.0 : bayerValue;
	bayerValue = ( index == 25 ) ? 28.0 : bayerValue;
	bayerValue = ( index == 26 ) ? 52.0 : bayerValue;
	bayerValue = ( index == 27 ) ? 20.0 : bayerValue;
	bayerValue = ( index == 28 ) ? 62.0 : bayerValue;
	bayerValue = ( index == 29 ) ? 30.0 : bayerValue;
	bayerValue = ( index == 30 ) ? 54.0 : bayerValue;
	bayerValue = ( index == 31 ) ? 22.0 : bayerValue;

	bayerValue = ( index == 32 ) ?  3.0 : bayerValue;
	bayerValue = ( index == 33 ) ? 35.0 : bayerValue;
	bayerValue = ( index == 34 ) ? 11.0 : bayerValue;
	bayerValue = ( index == 35 ) ? 43.0 : bayerValue;
	bayerValue = ( index == 36 ) ?  1.0 : bayerValue;
	bayerValue = ( index == 37 ) ? 33.0 : bayerValue;
	bayerValue = ( index == 38 ) ?  9.0 : bayerValue;
	bayerValue = ( index == 39 ) ? 41.0 : bayerValue;

	bayerValue = ( index == 40 ) ? 51.0 : bayerValue;
	bayerValue = ( index == 41 ) ? 19.0 : bayerValue;
	bayerValue = ( index == 42 ) ? 59.0 : bayerValue;
	bayerValue = ( index == 43 ) ? 27.0 : bayerValue;
	bayerValue = ( index == 44 ) ? 49.0 : bayerValue;
	bayerValue = ( index == 45 ) ? 17.0 : bayerValue;
	bayerValue = ( index == 46 ) ? 57.0 : bayerValue;
	bayerValue = ( index == 47 ) ? 25.0 : bayerValue;

	bayerValue = ( index == 48 ) ? 15.0 : bayerValue;
	bayerValue = ( index == 49 ) ? 47.0 : bayerValue;
	bayerValue = ( index == 50 ) ?  7.0 : bayerValue;
	bayerValue = ( index == 51 ) ? 39.0 : bayerValue;
	bayerValue = ( index == 52 ) ? 13.0 : bayerValue;
	bayerValue = ( index == 53 ) ? 45.0 : bayerValue;
	bayerValue = ( index == 54 ) ?  5.0 : bayerValue;
	bayerValue = ( index == 55 ) ? 37.0 : bayerValue;

	bayerValue = ( index == 56 ) ? 63.0 : bayerValue;
	bayerValue = ( index == 57 ) ? 31.0 : bayerValue;
	bayerValue = ( index == 58 ) ? 55.0 : bayerValue;
	bayerValue = ( index == 59 ) ? 23.0 : bayerValue;
	bayerValue = ( index == 60 ) ? 61.0 : bayerValue;
	bayerValue = ( index ==	61 ) ? 29.0 : bayerValue;
	bayerValue = ( index == 62 ) ? 53.0 : bayerValue;
	bayerValue = ( index == 63 ) ? 21.0 : bayerValue;

	float dithering = ( bayerValue / 255.0 ) / 32.0 - ( 1.0 / 128.0 );

	return color + dithering;
	
}