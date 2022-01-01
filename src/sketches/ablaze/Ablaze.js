import {
	CircleGeometry,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineBasicMaterial,
	LineSegments,
	MathUtils,
	Uniform,
	Vector3,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { GPGPU } from 'keda/three/gpgpu/GPGPU';
import { CameraBounds } from 'keda/three/misc/CameraBounds';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';

import { AblazeControls } from './AblazeControls';
import { AblazeSettings } from './AblazeSettings';
import GPGPU_x_shader from './shaders/GPGPU_x.frag';
import GPGPU_y_shader from './shaders/GPGPU_y.frag';
import GPGPU_z_shader from './shaders/GPGPU_z.frag';

class Ablaze extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: AblazeSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera,
			this.settings.particle.near,
			this.settings.particle.far
		);

		this.time = 0;
		this.wind = new Vector3();

	}

	init() {

		super.init();

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		this.controls = new AblazeControls( this );

	}

	build() {

		const { random, settings } = this;

		const textureSize = 128;
		const particleCount = textureSize * textureSize;

		// Base geometry

		const shape = new CircleGeometry( settings.particle.size, 3 );
		shape.rotateZ( Math.PI / 2 );
		const edges = new EdgesGeometry( shape );

		// Instanced Geometry

		const positions = new Float32Array( edges.attributes.position.array );
		const positionsX = new Float32Array( particleCount );
		const positionsY = new Float32Array( particleCount );
		const positionsZ = new Float32Array( particleCount );
		const targets = new Float32Array( particleCount * 2 );
		const noises = new Float32Array( particleCount );

		this.bounds.update();
		const { left, right, bottom, top, near, far } = this.bounds;

		for ( let i = 0, j = 0; i < particleCount; i ++ ) {

			positionsX[ i ] = random.number( left, right );
			positionsY[ i ] = random.number( bottom, top );
			positionsZ[ i ] = random.number( near, far );

			targets[ j ++ ] = ( i % textureSize ) / textureSize;
			targets[ j ++ ] = ~ ~ ( i / textureSize ) / textureSize;

			noises[ i ] = random.noise();

		}

		const geometry = new InstancedBufferGeometry();

		geometry.setAttribute(
			'position',
			new Float32BufferAttribute( positions, 3 )
		);
		geometry.setAttribute(
			'GPGPU_target',
			new InstancedBufferAttribute( targets, 2 )
		);
		geometry.setAttribute(
			'aNoise',
			new InstancedBufferAttribute( noises, 1 )
		);

		// Material

		const material = new LineBasicMaterial( settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		// Complete

		const particles = new LineSegments( geometry, material );
		particles.frustumCulled = false;
		this.particles = particles;
		this.add( particles );

		this.particleCountMax = particleCount;
		this.particleCountMin = Math.round( particleCount * 0.1 );
		this.updateInstanceCount();

		shape.dispose();
		edges.dispose();

		this.initGPGPU( positionsX, positionsY, positionsZ );

	}

	initGPGPU( positionsX, positionsY, positionsZ ) {

		GPGPU.init( this.sketchpad.renderer );

		const gpgpu = new GPGPU( this.particleCountMax );
		this.gpgpu = gpgpu;

		// GPGPU

		const { epsilon, speed, scale } = this.settings.curl;
		this.curlEpsilon = new Uniform( epsilon );
		this.curlScale = new Uniform( scale );
		this.curlSpeed = new Uniform( speed / ( epsilon * 2 ) );
		this.delta = new Uniform( 0 );
		this.time = new Uniform( 0 );

		const uniformsXYZ = {
			uEpsilon: this.curlEpsilon,
			uCurlScale: this.curlScale,
			uCurlSpeed: this.curlSpeed,
			uDelta: this.delta,
			uTime: this.time,
			uWind: { value: this.wind },
		};

		gpgpu.addVariable( 'x', {
			data: positionsX,
			shader: GPGPU_x_shader,
			uniforms: {
				GPGPU_y: { value: null },
				GPGPU_z: { value: null },
				uBounds: { value: this.bounds.x },
				...uniformsXYZ,
			},
		} );

		gpgpu.addVariable( 'y', {
			data: positionsY,
			shader: GPGPU_y_shader,
			uniforms: {
				GPGPU_x: { value: null },
				GPGPU_z: { value: null },
				uBounds: { value: this.bounds.y },
				...uniformsXYZ,
			},
		} );

		gpgpu.addVariable( 'z', {
			data: positionsZ,
			shader: GPGPU_z_shader,
			uniforms: {
				GPGPU_x: { value: null },
				GPGPU_y: { value: null },
				uBounds: { value: this.bounds.z },
				...uniformsXYZ,
			},
		} );

		this.shader = {
			uniforms: {
				uTime: this.time,
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

			attribute float aNoise;
			uniform float uTime;

			${ GPGPU.FloatPack.glsl }

			mat3 rotateZ( float angle ) {
				return mat3(
					vec3(   cos(angle),   -sin(angle),     0.0   ),
					vec3(   sin(angle),    cos(angle),     0.0   ),
					vec3(   0.0,           0.0,            1.0   )
				);
			}
		`;

		const vertexChanges = /*glsl*/`
			transformed *= rotateZ( uTime * 80.0 * aNoise );

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

	updateInstanceCount() {

		const instanceCount = Math.floor( MathUtils.clamp(
			this.settings.particle.count * this.camera.aspect,
			this.particleCountMin,
			this.particleCountMax
		) );
		this.particles.geometry.instanceCount = instanceCount;

	}

	resize( width, height, pixelRatio ) {

		super.resize( width, height, pixelRatio );

		if ( ! this.particles ) return;
		this.bounds.update();
		this.updateInstanceCount();

	}

	tick( delta, time ) {

		const { settings, gpgpu, shader } = this;

		this.delta.value = delta * settings.speed;
		this.time.value = time * settings.speed * settings.timeFactor;

		gpgpu.tick();

		shader.uniforms.GPGPU_x.value = gpgpu.x;
		shader.uniforms.GPGPU_y.value = gpgpu.y;
		shader.uniforms.GPGPU_z.value = gpgpu.z;

		gpgpu.setUniform( 'y', 'GPGPU_x', gpgpu.x );
		gpgpu.setUniform( 'z', 'GPGPU_x', gpgpu.x );
		gpgpu.setUniform( 'x', 'GPGPU_y', gpgpu.y );
		gpgpu.setUniform( 'z', 'GPGPU_y', gpgpu.y );
		gpgpu.setUniform( 'x', 'GPGPU_z', gpgpu.z );
		gpgpu.setUniform( 'y', 'GPGPU_z', gpgpu.z );

		super.tick( delta );

	}

}

export { Ablaze };
