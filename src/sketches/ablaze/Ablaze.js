import {
	CircleGeometry,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineBasicMaterial,
	LineSegments,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { GPGPU } from 'keda/three/gpgpu/GPGPU';

import { AblazeControls } from './AblazeControls';
import { AblazeSettings } from './AblazeSettings';
import GPGPU_x_shader from './shaders/GPGPU_x.frag';
import GPGPU_y_shader from './shaders/GPGPU_y.frag';
import GPGPU_z_shader from './shaders/GPGPU_z.frag';
import { CameraBounds } from '../../keda/three/misc/CameraBounds';

class Ablaze extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: AblazeSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera,
			this.settings.particle.near,
			this.settings.particle.far
		);

		this.time = 0;

	}

	init() {

		super.init();

		this.controls = new AblazeControls( this );

	}

	build() {

		const { random, settings } = this;

		const pixels = window.innerWidth * window.innerHeight;
		const particleCount = Math.round( pixels * 0.01 );
		//const particleCount = 1000;
		if ( this.debug ) console.log( { particleCount } );

		// Base geometry

		const disc = new CircleGeometry( settings.particle.size, 0 );
		disc.rotateZ( Math.PI / 2 );
		const edges = new EdgesGeometry( disc );

		// Instanced Geometry

		GPGPU.init( this.sketchpad.renderer );
		const gpgpu = new GPGPU( particleCount );
		const { textureSize } = gpgpu;

		const positions = new Float32Array( edges.attributes.position.array );
		const positionsX = new Float32Array( particleCount );
		const positionsY = new Float32Array( particleCount );
		const positionsZ = new Float32Array( particleCount );
		const targets = new Float32Array( particleCount * 2 );

		this.bounds.update();

		if ( this.debug ) console.log( this.bounds );

		const { left, right, bottom, top, near, far } = this.bounds;

		for ( let i = 0, j = 0; i < particleCount; i ++ ) {

			positionsX[ i ] = random.number( left, right );
			positionsY[ i ] = random.number( bottom, top );
			positionsZ[ i ] = random.number( near, far );

			targets[ j ++ ] = ( i % textureSize ) / textureSize;
			targets[ j ++ ] = ~ ~ ( i / textureSize ) / textureSize;

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = particleCount;
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute( positions, 3 )
		);
		geometry.setAttribute(
			'GPGPU_target',
			new InstancedBufferAttribute( targets, 2 )
		);

		// Material

		const material = new LineBasicMaterial( {
			color: '#ffff99',
		} );
		material.onBeforeCompile = this.editShader.bind( this );

		// Particles

		const particles = new LineSegments( geometry, material );
		particles.frustumCulled = false;
		//particles.position.copy( this.camera.position );
		//particles.quaternion.copy( this.camera.quaternion );
		this.add( particles );

		// GPGPU

		gpgpu.addVariable( 'x', {
			data: positionsX,
			shader: GPGPU_x_shader,
			uniforms: {
				uDelta: { value: 0 },
				uBounds: { value: this.bounds.x },
			},
		} );
		gpgpu.addVariable( 'y', {
			data: positionsY,
			shader: GPGPU_y_shader,
			uniforms: {
				uDelta: { value: 0 },
				uBounds: { value: this.bounds.y },
			},
		} );
		gpgpu.addVariable( 'z', {
			data: positionsZ,
			shader: GPGPU_z_shader,
			uniforms: {
				uDelta: { value: 0 },
				uBounds: { value: this.bounds.z },
			},
		} );

		this.gpgpu = gpgpu;

		this.shader = {
			uniforms: {
				GPGPU_x: { value: gpgpu.x },
				GPGPU_y: { value: gpgpu.y },
				GPGPU_z: { value: gpgpu.z },
			},
		};

	}

	editShader( shader ) {

		const common = '#include <common>';
		const beginVertex = '#include <begin_vertex>';

		// Vertex

		const vertexDeclarations = /*glsl*/`
			attribute vec2 GPGPU_target;
			uniform sampler2D GPGPU_x;
			uniform sampler2D GPGPU_y;
			uniform sampler2D GPGPU_z;
			${ GPGPU.FloatPack.glsl }
		`;

		const vertexChanges = /*glsl*/`
			transformed.x += unpackFloat( texture2D( GPGPU_x, GPGPU_target ) );
			transformed.y += unpackFloat( texture2D( GPGPU_y, GPGPU_target ) );
			transformed.z += unpackFloat( texture2D( GPGPU_z, GPGPU_target ) );
		`;

		// Apply

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

	//resize( width, height, pixelRatio ) {

	//	super.resize( width, height, pixelRatio );
	//	this.boundsNeedsUpdate = true;

	//}

	tick( delta ) {

		this.gpgpu.tick( delta * 0.0001 );
		this.shader.uniforms.GPGPU_x.value = this.gpgpu.x;
		this.shader.uniforms.GPGPU_y.value = this.gpgpu.y;
		this.shader.uniforms.GPGPU_z.value = this.gpgpu.z;

		//if ( this.boundsNeedsUpdate ) this.bounds.update();

		super.tick( delta );

	}

}

export { Ablaze };
