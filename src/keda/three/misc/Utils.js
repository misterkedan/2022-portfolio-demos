import { Vector3 } from 'three';

function editBasicMaterialShader(
	shader,
	vertexHead,
	vertexBody,
	fragmentHead,
	fragmentBody,
) {

	// THREE tokens ( r136 )
	const common = '#include <common>';
	const beginVertex = '#include <begin_vertex>';
	const logdepthbuf = '#include <logdepthbuf_fragment>';

	if ( vertexHead ) shader.vertexShader = shader.vertexShader.replace(
		common,
		common + vertexHead
	);

	if ( vertexBody ) shader.vertexShader = shader.vertexShader.replace(
		beginVertex,
		beginVertex + vertexBody
	);

	if ( fragmentHead ) shader.fragmentShader = shader.fragmentShader.replace(
		common,
		common + fragmentHead
	);

	if ( fragmentBody ) shader.fragmentShader = shader.fragmentShader.replace(
		logdepthbuf,
		fragmentBody + logdepthbuf
	);

}


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

function toVector3( { x, y, z } = {} ) {

	if (
		x === undefined &&
		y === undefined &&
		z === undefined
	) return;

	return new Vector3( x, y, z );

}

function trimFloat( float, decimals = 4, method = Math.round ) {

	var p = Math.pow( 10, decimals || 0 );
	var n = ( float * p ) * ( 1 + Number.EPSILON );
	return method( n ) / p;

}

export {
	editBasicMaterialShader,
	removeDuplicateVertices,
	toVector3,
	trimFloat,
};
