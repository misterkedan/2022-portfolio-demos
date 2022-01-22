import {
	CircleGeometry,
	Color,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineBasicMaterial,
	LineSegments,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	ShaderMaterial,
	Uniform,
	Vector3,
} from 'three';

import { GPGPU } from 'keda/three/gpgpu/GPGPU';
import { CameraBounds } from 'keda/three/misc/CameraBounds';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { Sketch } from 'keda/three/Sketch';

import { AblazeControls } from './AblazeControls';
import { AblazeSettings } from './AblazeSettings';
import { AblazeShaders } from './AblazeShaders';

class Ablaze extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: AblazeSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera,
			this.settings.particle.near,
			this.settings.particle.far
		);

	}

	init() {

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		super.init( AblazeControls );

	}

	initScene() {

		const { random, settings } = this;

		// Disc

		const discGeometry = new CircleGeometry(
			settings.disc.size, settings.disc.segments
		);
		const discMaterial = new MeshBasicMaterial( settings.disc.fill );
		const disc = new Mesh( discGeometry, discMaterial );
		disc.position.z = settings.particle.near + settings.disc.offset;
		this.add( disc );

		const circleGeometry = new EdgesGeometry( discGeometry );
		const circleMaterial = new LineBasicMaterial( settings.disc.stroke );
		const circle = new LineSegments( circleGeometry, circleMaterial );
		circle.position.copy( disc.position );
		this.add( circle );

		// Particle Geometry

		const { GPGPUTextureSize } = settings;
		const particleCount = GPGPUTextureSize * GPGPUTextureSize;

		const shape = new CircleGeometry( settings.particle.size, 3 );
		shape.rotateZ( Math.PI / 2 );
		const edges = new EdgesGeometry( shape );

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

			targets[ j ++ ] = ( i % GPGPUTextureSize ) / GPGPUTextureSize;
			targets[ j ++ ] = ~ ~ ( i / GPGPUTextureSize ) / GPGPUTextureSize;

			noises[ i ] = random.noise();

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = particleCount;
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( edges.attributes.position )
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

		this.particleCountMax = particleCount;
		this.particleCountMin = Math.round( particleCount * 0.1 );

		this.initUniforms( positionsX, positionsY, positionsZ );

		const material = new ShaderMaterial( AblazeShaders.material );

		// Complete

		const particles = new LineSegments( geometry, material );
		particles.frustumCulled = false;
		this.particles = particles;
		this.add( particles );

		this.updateInstanceCount();

		shape.dispose();
		edges.dispose();

	}

	initUniforms( positionsX, positionsY, positionsZ ) {

		const { settings } = this;

		// Uniforms

		const { epsilon, speed, scale, strength } = settings.curl;
		this.curlEpsilon = new Uniform( epsilon );
		this.curlScale = new Uniform( scale );
		this.curlSpeed = new Uniform( speed / ( epsilon * 2 ) );
		this.curlStrength = new Uniform( new Vector3(
			strength.x,
			strength.y,
			strength.z
		) );
		this.delta = new Uniform( 0 );
		this.time = new Uniform( 0 );
		this.wind = new Uniform( new Vector3() );

		const uniformsXYZ = {
			uEpsilon: this.curlEpsilon,
			uCurlScale: this.curlScale,
			uCurlSpeed: this.curlSpeed,
			uCurlStrength: this.curlStrength,
			uDelta: this.delta,
			uTime: this.time,
			uWind: this.wind,
		};

		// GPGPU

		const gpgpu = new GPGPU( this.particleCountMax );
		this.gpgpu = gpgpu;

		gpgpu.addVariable( 'x', {
			data: positionsX,
			shader: AblazeShaders.GPGPU_x,
			uniforms: {
				uBounds: { value: this.bounds.x },
				...uniformsXYZ,
			},
		} );

		gpgpu.addVariable( 'y', {
			data: positionsY,
			shader: AblazeShaders.GPGPU_y,
			uniforms: {
				uBounds: { value: this.bounds.y },
				...uniformsXYZ,
			},
		} );

		gpgpu.addVariable( 'z', {
			data: positionsZ,
			shader: AblazeShaders.GPGPU_z,
			uniforms: {
				uBounds: { value: this.bounds.z },
				...uniformsXYZ,
			},
		} );

		gpgpu.assign( 'x', 'y' );
		gpgpu.assign( 'x', 'z' );
		gpgpu.assign( 'y', 'x' );
		gpgpu.assign( 'y', 'z' );
		gpgpu.assign( 'z', 'x' );
		gpgpu.assign( 'z', 'y' );

		// Material uniforms

		const colorLow = new Color( settings.colorLow );
		const colorHigh = new Color( settings.colorHigh );

		AblazeShaders.material.uniforms = {
			opacity: 	new Uniform( settings.opacity ),
			uBounds: 	new Uniform( this.bounds.y ),
			uColorLow: 	new Uniform( colorLow ),
			uColorHigh: new Uniform( colorHigh ),
			uRotation: 	new Uniform( settings.rotation ),
			uScale: 	new Uniform( new Vector3(
				settings.scale.top,
				settings.scale.bottom,
				settings.scale.gradient,
			) ),
			uTime: this.time,
			GPGPU_x: gpgpu.x,
			GPGPU_y: gpgpu.y,
			GPGPU_z: gpgpu.z,
		};

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

	tick( delta ) {

		const scaledDelta = delta * this.settings.speed;
		this.delta.value = scaledDelta;
		this.time.value += scaledDelta * this.settings.timeFactor;

		this.gpgpu.tick();

		super.tick( delta );

	}

}

export { Ablaze };
