import {
	DynamicDrawUsage,
	InstancedBufferAttribute,
	InstancedMesh,
	MeshBasicMaterial,
	Object3D,
	RingGeometry,
	Vector3
} from 'three';
import { Random } from 'vesuna';

import { LinearGradient } from 'keda/three/misc/LinearGradient';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { Sketch } from 'keda/three/Sketch';

import { RainControls } from './RainControls';
import defaultSettings from './RainSettings';

class RainSketch extends Sketch {

	constructor( settings = {} ) {

		settings = {
			...defaultSettings,
			...settings
		};

		const { x, y, z } = settings.cameraStart;
		super( { cameraStart: new Vector3( x, y, z ) } );

		this.background = new LinearGradient( settings.background );
		this.add( this.background );

		this.settings = settings;
		this.speed = settings.speed.min;
		this.y = settings.offsetY;
		this.originZ = settings.originZ;

		this.random = new Random();

	}

	build() {

		// Create InstancedMesh

		const { innerRadius, outerRadius, thetaSegments } = this.settings.geometry;
		const geometry = new RingGeometry( innerRadius, outerRadius, thetaSegments );
		geometry.rotateX( - Math.PI / 2 );

		const material = new MeshBasicMaterial( this.settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		const { instances } = this.settings;
		this.mesh = new InstancedMesh( geometry, material, instances );
		this.add( this.mesh );

		this.dummy = new Object3D(); // For instanceMatrix updates

		// Set instances

		const progress = new Float32Array( instances );
		this.x = new Float32Array( instances );
		this.z = new Float32Array( instances );

		for ( let i = 0; i < instances; i ++ ) {

			this.randomizeDummy( i );

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

	updateAspect() {

		const { aspect } = this.stage.camera;

		this.maxCount = this.settings.instances;
		this.maxCount = ( aspect < 1 )
			? Math.round( this.settings.instances * aspect )
			: this.settings.instances;

		this.width = this.stage.getVisibleWidth(
			this.settings.originZ
		);
		this.depth = this.width * this.settings.ratio / aspect;

	}

	randomizeDummy( i ) {

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

	editShader( shader ) {

		/*eslint-disable*/
		const common = /*glsl*/`#include <common>`;
		const vertDefs = /*glsl*/`
			attribute float aProgress;
			varying float vProgress;
		`;
		const fragDefs = /*glsl*/`
			varying float vProgress;
		`;

		const vertToken = /*glsl*/`#include <begin_vertex>`;
		const vertInsert = /*glsl*/`
			vProgress = aProgress;
		`;

		const fragToken = /*glsl*/`vec4 diffuseColor = vec4( diffuse, opacity );`
		const fragEdit = /*glsl*/`
			float progressOpacity =  opacity * mod( 1.0 - vProgress, 1.0 );
			vec4 diffuseColor = vec4( diffuse, progressOpacity );
		`;
		/*eslint-enable*/

		shader.vertexShader = shader.vertexShader
			.replace( common, common + vertDefs )
			.replace( vertToken, vertToken + vertInsert );

		shader.fragmentShader = shader.fragmentShader
			.replace( common, common + fragDefs )
			.replace( fragToken, fragEdit );

	}

	/*-------------------------------------------------------------------------/

		Sketch overrides

	/-------------------------------------------------------------------------*/

	init( sketchpad ) {

		super.init( sketchpad );

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		this.build();
		this.controls = new RainControls( this );

	}

	resize( width, height, pixelRatio ) {

		super.resize( width, height, pixelRatio );

		this.controls?.resize( width, height );

		this.updateAspect();

	}

	tick() {

		const progressArray = this.mesh.geometry.attributes.aProgress.array;

		for ( let i = 0; i < this.mesh.count; i ++ ) {

			let progress = progressArray[ i ] + this.speed;
			if ( progress > 1 ) {

				progress = 0;
				this.randomizeDummy( i );

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

		this.controls.tick();
		super.tick();

	}

}

export { RainSketch };
