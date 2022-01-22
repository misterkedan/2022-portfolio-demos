import {
	CircleGeometry,
	Color,
	DynamicDrawUsage,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	InstancedMesh,
	LineSegments,
	MeshBasicMaterial,
	Object3D,
	RingGeometry,
	ShaderMaterial,
	Uniform,
} from 'three';

import { Simplex } from 'keda/random/Simplex';
import { CameraBounds } from 'keda/three/misc/CameraBounds';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { Sketch } from 'keda/three/Sketch';

import { RainControls } from './RainControls';
import { RainSettings } from './RainSettings';
import { RainShaders } from './RainShaders';

class Rain extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: RainSettings, settings } );

		// Random
		this.y = this.settings.offsetY;
		this.speed = this.settings.speed.min;
		this.originZ = this.settings.originZ;

		// Targeted
		this.simplex = new Simplex( this.random );
		this.instance = 0;
		this.counter = 0;
		this.baseDelay = 3;
		this.delay = 0.00001;
		this.noise = 0;
		this.activity = 0;

	}

	init() {

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		super.init( RainControls );

		this.controls.projector.plane.position.set( 0, this.y, 0 );

	}

	initScene() {

		this.initRandomImpacts();
		this.initTargetedImpacts();

	}

	tick( delta ) {

		if ( ! this.speed ) return super.tick( delta );

		const speed = this.speed * delta;

		this.tickRandom( speed );
		this.tickCursor( speed );

		super.tick( delta );

	}

	/*-----------------------------------------------------------------------------/

		Random Impacts

	/-----------------------------------------------------------------------------*/

	initRandomImpacts() {

		// Create InstancedMesh

		const { innerRadius, outerRadius, thetaSegments } = this.settings.geometry;
		const geometry = new RingGeometry( innerRadius, outerRadius, thetaSegments );
		geometry.rotateX( - Math.PI / 2 );

		const material = new MeshBasicMaterial( this.settings.material );
		material.onBeforeCompile = RainShaders.edit;

		const { instances } = this.settings;
		this.mesh = new InstancedMesh( geometry, material, instances );
		this.add( this.mesh );

		this.dummy = new Object3D(); // For instanceMatrix updates

		// Set instances

		const progress = new Float32Array( instances );
		this.x = new Float32Array( instances );
		this.z = new Float32Array( instances );

		for ( let i = 0; i < instances; i ++ ) {

			this.randomizePositionAt( i );

			const amount = this.random.amount();
			this.dummy.scale.set( amount, amount, amount );
			progress[ i ] = amount;

			this.dummy.updateMatrix();
			this.mesh.setMatrixAt( i, this.dummy.matrix );

		}

		geometry.setAttribute(
			'aProgress', new InstancedBufferAttribute( progress, 1 )
		);

		this.mesh.instanceMatrix.setUsage( DynamicDrawUsage );
		this.mesh.count = this.maxCount;

	}

	randomizePositionAt( i ) {

		const angle = this.random.number( 0, this.settings.maxAngle );

		this.dummy.position.set(
			Math.cos( angle ) * this.random.amount() * this.width,
			this.y,
			Math.sin( angle ) * this.random.amount() * this.depth
				+ this.settings.originZ
		);

		this.x[ i ] = this.dummy.position.x;
		this.z[ i ] = this.dummy.position.z;

	}

	updateAspect( aspect = this.camera.aspect ) {

		this.maxCount = this.settings.instances;
		this.maxCount = ( aspect < 1 )
			? Math.round( this.settings.instances * aspect )
			: this.settings.instances;

		this.width = CameraBounds.getVisibleWidth(
			this.camera,
			this.settings.originZ
		) * this.settings.spread;
		this.depth = this.width * this.settings.ratio / aspect;

	}

	resize( width, height, pixelRatio ) {

		super.resize( width, height, pixelRatio );
		this.updateAspect();

	}

	tickRandom( speed ) {

		const progressArray = this.mesh.geometry.attributes.aProgress.array;

		for ( let i = 0; i < this.mesh.count; i ++ ) {

			let progress = progressArray[ i ] + speed;

			if ( progress > 1 ) {

				progress = 0;
				this.randomizePositionAt( i );

			} else {

				this.dummy.position.set( this.x[ i ], this.y, this.z[ i ] );

			}

			this.dummy.scale.set( progress, progress, progress );

			this.dummy.updateMatrix();
			this.mesh.setMatrixAt( i, this.dummy.matrix );

			progressArray[ i ] = progress;

		}

		this.mesh.instanceMatrix.needsUpdate = true;
		this.mesh.geometry.attributes.aProgress.needsUpdate = true;

	}

	/*-------------------------------------------------------------------------/

		Targeted impacts

	/-------------------------------------------------------------------------*/

	initTargetedImpacts() {

		const { settings } = this;

		const base = new CircleGeometry( settings.outerRadius, 6 );
		base.rotateX( - Math.PI / 2 );

		const edges = new EdgesGeometry( base );

		const instanceCount = settings.instanceCount;

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = instanceCount;

		const attributeCount = instanceCount * 3;
		const offsets = new Float32Array( attributeCount );

		for ( let i = 0; i < attributeCount; i += 3 ) {

			offsets[ i ] = - 100;
			offsets[ i + 2 ] = - 100;

		}

		//geometry.setIndex( new Uint16BufferAttribute().copy( base.index ) );
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( edges.attributes.position )
		);
		geometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute( offsets, 3 )
		);
		geometry.setAttribute(
			'aLife',
			new InstancedBufferAttribute(
				new Float32Array( instanceCount ).fill( 1 ), 1
			)
		);

		// Material

		this.targeted = { geometry };
		this.targeted.uniforms = {
			uScaleMin: new Uniform( settings.targeted.scale.min ),
			uScaleMax: new Uniform( settings.targeted.scale.max ),
			// Fragment shader
			color: new Uniform( new Color( settings.material.color ) ),
			opacity: new Uniform( 1 ),
		};
		RainShaders.impact.uniforms = this.targeted.uniforms;
		const material = new ShaderMaterial( RainShaders.impact );

		// Final

		this.cursorImpacts = new LineSegments( geometry, material );
		this.cursorImpacts.position.set( 0, this.y, 0 );
		this.add( this.cursorImpacts );

	}

	generateAt( position ) {

		const { random } = this;
		const { scatter, spread } = this.settings.targeted;

		const { aOffset, aLife } = this.targeted.geometry.attributes;

		const randomly = random.chance( scatter );

		const x = ( randomly )
			? position.x + random.noise() * spread * this.activity
			: position.x;
		const z = ( randomly )
			? position.z + random.noise() * spread * this.activity
			: position.z;

		const index = this.instance * 3;
		aOffset.array[ index ] = x;
		aOffset.array[ index + 2 ] = z;

		aLife.array[ this.instance ] = 0;
		this.instance = ( this.instance + 1 ) % this.settings.instanceCount;

		aOffset.needsUpdate = true;

	}

	tickCursor( speed ) {

		this.counter += speed;

		if ( this.counter > this.delay ) {

			const { position } = this.controls.cursor;
			this.generateAt( position );
			this.noise = this.simplex.noise3D(
				position.x, position.y, this.counter
			);
			this.counter = 0;

		}

		//let actives = 0;

		for ( let i = 0; i < this.settings.instanceCount; i ++ ) {

			this.targeted.geometry.attributes.aLife.array[ i ] += speed;
			//if ( this.targeted.geometry.attributes.aLife.array[ i ] < 1 ) actives ++;

		}

		//console.log( { actives } );

		this.targeted.geometry.attributes.aLife.needsUpdate = true;

	}

}

export { Rain };
