import { Vector3 } from 'three';

function removeDuplicateVertices( geometry, decimalPlaces = 4 ) {

	const positions = geometry.attributes.position.array;
	const separator = '|';
	const stringVertices = [];

	for ( let i = 0; i < positions.length; i += 3 ) {

		const x = trimFloat( positions[   i   ], decimalPlaces );
		const y = trimFloat( positions[ i + 1 ], decimalPlaces );
		const z = trimFloat( positions[ i + 2 ], decimalPlaces );
		stringVertices.push( [ x, y, z ].join( separator ) );

	}

	const deduped = Array.from( new Set( stringVertices ) );

	const output = deduped.reduce( ( array, stringVertex ) => {

		const vertex = stringVertex.split( separator );
		vertex.forEach( position => array.push( Number( position ) ) );
		return array;

	}, [] );

	return output;

}

function trimFloat( float, decimals = 4, method = Math.round ) {

	var p = Math.pow( 10, decimals || 0 );
	var n = ( float * p ) * ( 1 + Number.EPSILON );
	return method( n ) / p;

}

function toVector3( { x, y, z } = {} ) {

	if (
		x === undefined &&
		y === undefined &&
		z === undefined
	) return;

	return new Vector3( x, y, z );

}

export {
	removeDuplicateVertices,
	toVector3,
	trimFloat,
};
