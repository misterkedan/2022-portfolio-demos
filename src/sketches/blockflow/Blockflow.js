import {
	BoxGeometry,
	Color,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineSegments,
	PlaneGeometry,
	ShaderMaterial,
	Uniform
} from 'three';

import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { Sketch } from 'keda/three/Sketch';

import { BlockflowSettings } from './BlockflowSettings';
import { BlockflowControls } from './BlockflowControls';
import { BlockflowShader } from './BlockflowShader';

class Blockflow extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BlockflowSettings, settings } );

		settings = this.settings;

		this.cursor = new Uniform( null );

		this.amplitude = new Uniform( settings.amplitude.value );
		this.scale = new Uniform( settings.scale.value );
		this.thickness = new Uniform( settings.thickness.value );
		this.turbulence = new Uniform( settings.turbulence.value );
		this.time = new Uniform( 0 );

		this.opacity = new Uniform( settings.opacity.value );
		this.colorLow = new Uniform( new Color( settings.colorLow ) );
		this.colorHigh = new Uniform( new Color( settings.colorHigh ) );

		this.setSpeed();

	}

	init() {

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		super.init( BlockflowControls );

		this.cursor.value = this.controls.cursor.position;

	}

	initScene() {

		// Computations

		const { settings } = this;
		const { tile } = settings;
		const instances = tile.countX * tile.countZ;

		const netWidth = tile.width + tile.margin.x;
		const netDepth = tile.depth + tile.margin.z;
		this.width = netWidth * tile.countX - tile.margin.x;
		this.depth = netDepth * tile.countZ - tile.margin.z;

		const offsetX = - ( this.width - tile.width ) / 2;
		const offsetY = - tile.height * 0.5;
		const offsetZ = - ( this.depth - tile.depth ) / 2;

		if ( this.debug ) console.log( { instances } );

		// Geometry

		const box = new BoxGeometry( tile.width, tile.height, tile.depth );
		const edges = new EdgesGeometry( box );

		const positions = new Float32Array( edges.attributes.position.array );
		const attributeCount = 3 * instances;
		const offsets = new Float32Array( attributeCount );

		let tileX = 0;
		let tileZ = 0;

		for ( let i = 0; i < attributeCount; i += 3 ) {

			offsets[   i   ] = offsetX + tileX * netWidth;
			offsets[ i + 1 ] = offsetY;
			offsets[ i + 2 ] = offsetZ + tileZ * netDepth;

			tileX = ( tileX + 1 ) % tile.countX;
			if ( tileX === 0 ) tileZ ++;

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = instances;
		geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'aOffset', new InstancedBufferAttribute( offsets, 3 ) );

		// Material

		BlockflowShader.uniforms = {
			// Vertex
			uCursor: 	 this.cursor,
			uAmplitude:  this.amplitude,
			uScale: 	 this.scale,
			uThickness:  this.thickness,
			uTurbulence: this.turbulence,
			uTime: 		 this.time,
			// Fragment
			opacity: 	this.opacity,
			uColorLow: 	this.colorLow,
			uColorHigh: this.colorHigh,
		};

		const material = new ShaderMaterial( BlockflowShader );

		// Grid

		this.grid = new LineSegments( geometry, material );
		this.add( this.grid );

		// Border

		const plane = new PlaneGeometry(
			this.width + settings.border,
			this.depth + settings.border,
		);
		plane.rotateX( - Math.PI / 2 );
		this.border = new LineSegments( new EdgesGeometry( plane ), material );
		this.add( this.border );

		// Cleanup

		this.geometry = geometry;
		this.material = material;

		box.dispose();
		edges.dispose();
		plane.dispose();

	}

	tick( delta ) {

		this.time.value += delta * this.speed;

		super.tick( delta );

	}

	setSpeed( speed = this.settings.speed.value, multiplier = 0.0001 ) {

		this.speed = speed * multiplier;

	}

	clear() {

		this.remove( this.grid );
		this.geometry.dispose();
		this.material.dispose();

		this.remove( this.border );
		this.border.geometry.dispose();
		this.border.material.dispose();

	}

	rebuild() {

		this.clear();
		this.initScene();
		this.controls.updateProjectorBounds();

	}

}

export { Blockflow };
