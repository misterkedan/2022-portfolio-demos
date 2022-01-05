vec3 bayerMatrixDither( vec3 color ) {

	// Silly code because old devices ( OpenGL ES < 3 ) don't support arrays

	int index = int( mod( gl_FragCoord.x - 0.5, 8.0 ) ) + 
		int( mod( gl_FragCoord.y - 0.5, 8.0 ) * 8.0 );

	float dither = 0.0;

	dither = ( index == 1 ) ? 0.0039216 : dither;
	dither = ( index == 2 ) ? 0.0009804 : dither;
	dither = ( index == 3 ) ? 0.004902  : dither;
	dither = ( index == 4 ) ? 0.0002451 : dither;
	dither = ( index == 5 ) ? 0.0041667 : dither;
	dither = ( index == 6 ) ? 0.0012255 : dither;
	dither = ( index == 7 ) ? 0.0051471 : dither;

	dither = ( index == 8 )  ? 0.0058824 : dither;
	dither = ( index == 9 )  ? 0.0019608 : dither;
	dither = ( index == 10 ) ? 0.0068628 : dither;
	dither = ( index == 11 ) ? 0.0029412 : dither;
	dither = ( index == 12 ) ? 0.0061275 : dither;
	dither = ( index == 13 ) ? 0.0022059 : dither;
	dither = ( index == 14 ) ? 0.0071079 : dither;
	dither = ( index == 15 ) ? 0.0031863 : dither;

	dither = ( index == 16 ) ? 0.0014706 : dither;
	dither = ( index == 17 ) ? 0.0053922 : dither;
	dither = ( index == 18 ) ? 0.0004902 : dither;
	dither = ( index == 19 ) ? 0.0044118 : dither;
	dither = ( index == 20 ) ? 0.0017157 : dither;
	dither = ( index == 21 ) ? 0.0056373 : dither;
	dither = ( index == 22 ) ? 0.0007353 : dither;
	dither = ( index == 23 ) ? 0.0046569 : dither;

	dither = ( index == 24 ) ? 0.007353  : dither;
	dither = ( index == 25 ) ? 0.0034314 : dither;
	dither = ( index == 26 ) ? 0.0063726 : dither;
	dither = ( index == 27 ) ? 0.002451  : dither;
	dither = ( index == 28 ) ? 0.0075981 : dither;
	dither = ( index == 29 ) ? 0.0036765 : dither;
	dither = ( index == 30 ) ? 0.0066177 : dither;
	dither = ( index == 31 ) ? 0.0026961 : dither;

	dither = ( index == 32 ) ? 0.00036765 : dither;
	dither = ( index == 33 ) ? 0.00428925 : dither;
	dither = ( index == 34 ) ? 0.00134805 : dither;
	dither = ( index == 35 ) ? 0.00526965 : dither;
	dither = ( index == 36 ) ? 0.00012255 : dither;
	dither = ( index == 37 ) ? 0.00404415 : dither;
	dither = ( index == 38 ) ? 0.00110295 : dither;
	dither = ( index == 39 ) ? 0.00502455 : dither;

	dither = ( index == 40 ) ? 0.00625005 : dither;
	dither = ( index == 41 ) ? 0.00232845 : dither;
	dither = ( index == 42 ) ? 0.00723045 : dither;
	dither = ( index == 43 ) ? 0.00330885 : dither;
	dither = ( index == 44 ) ? 0.00600495 : dither;
	dither = ( index == 45 ) ? 0.00208335 : dither;
	dither = ( index == 46 ) ? 0.00698535 : dither;
	dither = ( index == 47 ) ? 0.00306375 : dither;

	dither = ( index == 48 ) ? 0.00183825 : dither;
	dither = ( index == 49 ) ? 0.00575985 : dither;
	dither = ( index == 50 ) ? 0.00085785 : dither;
	dither = ( index == 51 ) ? 0.00477945 : dither;
	dither = ( index == 52 ) ? 0.00159315 : dither;
	dither = ( index == 53 ) ? 0.00551475 : dither;
	dither = ( index == 54 ) ? 0.00061275 : dither;
	dither = ( index == 55 ) ? 0.00453435 : dither;

	dither = ( index == 56 ) ? 0.00772065 : dither;
	dither = ( index == 57 ) ? 0.00379905 : dither;
	dither = ( index == 58 ) ? 0.00674025 : dither;
	dither = ( index == 59 ) ? 0.00281865 : dither;
	dither = ( index == 60 ) ? 0.00747555 : dither;
	dither = ( index ==	61 ) ? 0.00355395 : dither;
	dither = ( index == 62 ) ? 0.00649515 : dither;
	dither = ( index == 63 ) ? 0.00257355 : dither;

	return color + dither;
	
}