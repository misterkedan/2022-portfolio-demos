import {
	BoxGeometry,
	Color,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	ShaderMaterial,
	EdgesGeometry,
	LineSegments,
	Uniform,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { Simplex } from 'keda/random/Simplex';

import { CyberdarkControls } from './CyberdarkControls';
import { CyberdarkSettings } from './CyberdarkSettings';
import { CyberdarkShader } from './CyberdarkShader';

class Cyberdark extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: CyberdarkSettings, settings } );

		this.simplex = new Simplex( this.random );
		this.traveled = new Uniform( 0 );
		this.depth = new Uniform( this.settings.depth );
		this.speed = this.settings.speed.value;

		this.offset = 0;

	}

	init() {

		super.init( CyberdarkControls );

		//this.controls.initGUI();

	}

	initScene() {

		const { random, simplex, settings } = this;

		const {
			color, opacity, size, length, count, noiseScale, bounds, variance,
		} = settings.particle;

		const base = new BoxGeometry( size, size, size * length );
		const edges = new EdgesGeometry( base );

		const attributeCount = count * 3;
		const offsets = new Float32Array( attributeCount );
		const speeds = new Float32Array( count );

		for ( let i = 0, j = 0; i < attributeCount; i += 3 ) {

			const z = random.number( 0, this.depth.value );
			const y = simplex.noise2D( z * noiseScale, i * noiseScale ) * bounds.y;
			const x = simplex.noise2D( y * noiseScale, z * noiseScale ) * bounds.x;

			offsets[ i ] = x;
			offsets[ i + 1 ] = y;
			offsets[ i + 2 ] = z;

			speeds[ j ++ ] = variance * ( 0.5 + simplex.noise3D( x, y, z ) * 0.5 );

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = count;
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( edges.attributes.position )
		);
		geometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute( offsets, 3 )
		);
		geometry.setAttribute(
			'aSpeed',
			new InstancedBufferAttribute( speeds, 1 )
		);


		this.color = new Uniform( new Color( color ) ),
		this.opacity = new Uniform( opacity ),

		CyberdarkShader.uniforms = {
			color: this.color,
			opacity: this.opacity,
			uDepth: this.depth,
			uTraveled: this.traveled,
		};
		const material = new ShaderMaterial( CyberdarkShader );

		const particles = new LineSegments( geometry, material );
		particles.frustumCulled = false;
		particles.position.z = - this.depth.value;
		this.add( particles );

		this.particles = particles;
		base.dispose();
		edges.dispose();

	}

	tick( delta ) {

		this.traveled.value += delta * this.speed;

		super.tick( delta );

	}

}

export { Cyberdark };
