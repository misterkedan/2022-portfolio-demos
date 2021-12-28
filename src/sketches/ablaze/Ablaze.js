import {
	BufferGeometry,
	Float32BufferAttribute,
	Points,
	PointsMaterial,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { CameraBounds } from 'keda/three/misc/CameraBounds';

import { AblazeControls } from './AblazeControls';
import { AblazeSettings } from './AblazeSettings';

class Ablaze extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: AblazeSettings, settings } );

		this.bounds = new CameraBounds( this.camera, true );
		this.bounds.update();

		this.time = 0;

	}

	init() {

		super.init();

		this.controls = new AblazeControls( this );

	}

	build() {

		const { random } = this;

		const pixels = window.innerWidth * window.innerHeight;
		const particleCount = Math.round( pixels * 0.04 );
		if ( this.debug ) console.log( { particleCount } );

		const positionsCount = particleCount * 3;
		const positions = new Float32Array( positionsCount );
		const { left, right, top, bottom, near, far } = this.bounds;

		for ( let i = 0; i < positionsCount; i += 3 ) {

			positions[ i ] = random.number( left, right );
			positions[ i + 1 ] = random.number( bottom, top );
			positions[ i + 2 ] = random.number( near, far );

		}

		const geometry = new BufferGeometry();

		geometry.setAttribute(
			'position',
			new Float32BufferAttribute( positions, 3 )
		);

		this.shader = {
			uniforms: {
				uTime: { value: 0 },
				uBoundsX: { value: this.bounds.x },
				uBoundsY: { value: this.bounds.y },
				uBoundsZ: { value: this.bounds.z },
			},
		};

		const material = new PointsMaterial( {
			size: 0.007,
			color: '#ffff99',
		} );
		material.onBeforeCompile = this.editShader.bind( this );

		const particles = new Points( geometry, material );
		this.add( particles );

		if ( ! this.bounds.fixedCamera ) {

			particles.position.copy( this.camera.position );
			particles.quaternion.copy( this.camera.quaternion );

		}

	}

	editShader( shader ) {

		const common = '#include <common>';
		const beginVertex = '#include <begin_vertex>';

		// Vertex

		const vertexDeclarations = /*glsl*/`
			uniform float uTime;
			uniform vec2 uBoundsX;
			uniform vec2 uBoundsY;
			uniform vec2 uBoundsZ;

			float loopNumber( float number, float minimum, float change ) {

				return minimum + mod( number - minimum, change );

			}
		`;

		const vertexChanges = /*glsl*/`
			transformed.x = loopNumber( 
				transformed.x, 
				uBoundsX.x, 
				uBoundsX.y
			);
			transformed.y = loopNumber( 
				transformed.y - uTime, 
				uBoundsY.x, 
				uBoundsY.y
			);
			transformed.z = loopNumber( 
				transformed.z, 
				uBoundsZ.x, 
				uBoundsZ.y
			);
		`;

		shader.vertexShader = shader.vertexShader.replace(
			common,
			common + vertexDeclarations
		);
		shader.vertexShader = shader.vertexShader.replace(
			beginVertex,
			beginVertex + vertexChanges
		);

		Object.assign( shader.uniforms, this.shader.uniforms );

		this.shader = shader;

	}

	resize( width, height, pixelRatio ) {

		super.resize( width, height, pixelRatio );

		this.bounds.needsUpdate = true;

	}

	tick( delta ) {

		this.time += delta * 0.0005;
		this.shader.uniforms.uTime.value = this.time;

		if ( this.bounds.needsUpdate ) this.bounds.update();

		super.tick( delta );

	}

}

export { Ablaze };
