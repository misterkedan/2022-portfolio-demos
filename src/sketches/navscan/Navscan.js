import {
	BufferGeometry,
	Color,
	LineSegments,
	Vector3,
	Uniform,
	Float32BufferAttribute,
	ShaderMaterial
} from 'three';

import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { Sketch } from 'keda/three/Sketch';

import { NavscanControls } from './NavscanControls';
import { NavscanSettings } from './NavscanSettings';
import { NavscanShader } from './NavscanShader';

class Navscan extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: NavscanSettings, settings } );

		settings = this.settings;
		this.amp = new Uniform( 2 );
		this.distance = new Uniform( 0 );
		this.tileDepth = new Uniform( settings.tiles.depth );
		this.noiseScale = new Uniform( new Vector3( 0.1, 0.03, 0.07 ) );
		this.color = new Uniform( new Color( settings.grid.color ) );
		this.opacity = new Uniform( settings.grid.opacity );

	}

	init() {

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		super.init( NavscanControls );

	}

	initScene() {

		const { settings } = this;

		const width = settings.tiles.x * settings.tiles.width;
		const depth = settings.tiles.z * settings.tiles.depth;
		const offsetX = - width / 2;
		const offsetZ = - depth;

		const pointsX = settings.tiles.x + 1;
		const pointsZ = settings.tiles.z + 1;

		const tiles = settings.tiles.x * settings.tiles.z;
		const points = pointsX * pointsZ;
		const vertices = tiles * 8; // 2 points * 4 lines

		if ( this.debug ) console.log( { points, tiles } );

		const positions = new Float32Array( vertices * 3 );

		// Compute tiles

		const positionsX = new Float32Array( points );
		const positionsZ = new Float32Array( points );
		let positionX = 0;
		let positionZ = 0;
		let pointX = 0;
		let pointZ = 0;

		for ( let point = 0; point < points; point ++ ) {

			positionsX[ positionX ++ ] = offsetX + settings.tiles.width * pointX;
			positionsZ[ positionZ ++ ] = offsetZ + settings.tiles.depth * pointZ;

			pointX = ( pointX + 1 ) % pointsX;
			if ( pointX === 0 ) pointZ ++;

		}

		// Fill geometry

		let position = 0;
		let tileX = 0;
		let tileZ = 0;

		pointX = 0;
		pointZ = 0;

		let backLeft, backRight, frontLeft, frontRight;

		const addVertex = ( index ) => {

			positions[ position ++ ] = positionsX[ index ];
			positions[ position ++ ] = 0;
			positions[ position ++ ] = positionsZ[ index ];

		};

		const addLine = ( a, b ) => {

			addVertex( a );
			addVertex( b );

		};

		for ( let tile = 0; tile < tiles; tile ++ ) {

			backLeft = tile + tileZ;
			backRight = backLeft + 1;
			frontLeft = tile + pointsX + tileZ;
			frontRight = frontLeft + 1;

			addLine( backLeft, backRight );
			addLine( backRight, frontRight );
			addLine( frontRight, frontLeft );
			addLine( frontLeft, backLeft );

			tileX = ( tileX + 1 ) % settings.tiles.x;
			if ( tileX === 0 ) tileZ ++;

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );

		// Material

		NavscanShader.uniforms = {
			color: this.color,
			opacity: this.opacity,
			uAmp: this.amp,
			uDistance: this.distance,
			uNoiseScale: this.noiseScale,
			uTileDepth: this.tileDepth,
		};

		const material = new ShaderMaterial( NavscanShader );

		// Result

		const grid = new LineSegments( geometry, material );
		grid.position.set( 0, 0, settings.grid.z );
		this.add( grid );
		this.grid = grid;

	}

	tick( delta ) {

		this.distance.value += this.settings.speed.value * delta;
		super.tick( delta );

	}

	clear() {

		this.remove( this.grid );
		this.grid.geometry.dispose();
		this.grid.material.dispose();

	}

	rebuild() {

		this.clear();

		this.tileDepth.value = this.settings.tiles.depth;
		this.initScene();

	}

}

export { Navscan };
