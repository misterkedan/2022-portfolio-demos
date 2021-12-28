import {
	BufferGeometry,
	Points,
	PointsMaterial,
	Vector3,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { AblazeControls } from './AblazeControls';
import { AblazeSettings } from './AblazeSettings';
import { Float32BufferAttribute } from 'three';
import { Vector2 } from 'three';

class Ablaze extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: AblazeSettings, settings } );

		this.time = 0;

	}

	init() {

		super.init();

		this.controls = new AblazeControls( this );

	}

	build() {

		const { random } = this;

		const geometry = new BufferGeometry();

		//const particleCount = 50000;
		const particleCount = Math.ceil(
			window.innerWidth * window.innerHeight * 0.03
		);

		console.log( particleCount );

		const positionsCount = particleCount * 3;
		const positions = new Float32Array( positionsCount );

		const unproject = ( x, y, z ) => new Vector3( x, y, z )
			.unproject( this.camera );

		const scale = 1;
		const min = - scale;
		const max = scale;

		const leftBottom = unproject( min, min, max );
		const left = leftBottom.x;
		const bottom = leftBottom.y;

		const rightTop = unproject( max, max, max );
		const right = rightTop.x;
		const top = rightTop.y;

		const near = unproject( 0, 0, min ).z;
		const far = unproject( 0, 0, max ).z;

		this.bounds = { top, bottom, left, right, near, far };

		for ( let i = 0; i < positionsCount; i += 3 ) {

			positions[ i ] = random.number( left, right );
			positions[ i + 1 ] = random.number( bottom, top );
			positions[ i + 2 ] = random.number( near, far );

		}

		geometry.setAttribute(
			'position',
			new Float32BufferAttribute( positions, 3 )
		);

		this.shader = {
			uniforms: {
				uTime: { value: 0 },
				uBoundsX: { value: new Vector2( left, right - left ) },
				uBoundsY: { value: new Vector2( bottom, top - bottom ) },
				uBoundsZ: { value: new Vector2( near, far - near ) },
			},
		};

		const material = new PointsMaterial( { size: 0.007, color: '#ffff99' } );
		material.onBeforeCompile = this.editShader.bind( this );

		const particles = new Points( geometry, material );
		this.add( particles );

	}

	editShader( shader ) {

		const common = '#include <common>';
		const beginVertex = '#include <begin_vertex>';

		// Vertex

		const vertexDeclarations = /*glsl*/`
			uniform float uTime;
			uniform vec2 uBoundsY;

			float loopNumber( float number, float minimum, float change ) {

				return minimum + mod( number - minimum, change );

			}
		`;

		const vertexChanges = /*glsl*/`
			transformed.y = loopNumber( 
				transformed.y - uTime, 
				uBoundsY.x, 
				uBoundsY.y
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

	tick( delta ) {

		this.time += delta * 0.0005;
		this.shader.uniforms.uTime.value = this.time;

		super.tick( delta );

	}

}

export { Ablaze };
