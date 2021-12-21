import {
	DynamicDrawUsage,
	InstancedBufferAttribute,
	InstancedMesh,
	MathUtils,
	MeshBasicMaterial,
	Object3D,
	RingGeometry,
	Vector3
} from 'three';
import { Vesuna } from 'vesuna';
import { Sketch } from '../../sketchpad/Sketch';
import { LinearGradient } from '../../sketchpad/three/LinearGradient';
import { DitheredUnrealBloomPass } from '../../sketchpad/three/postprocessing/DitheredUnrealBloomPass';
import { RainSketchControls } from './RainSketchControls';

class RainSketch extends Sketch {

	constructor() {

		super( { cameraStart: new Vector3( 0, 5, 10 ) } );

		this.background = new LinearGradient( {
			color1: 0x26004d,
			color2: 0x0065d1
		} );
		this.add( this.background );

		this.instances = 1750;
		this.speed = 0.01;

		this.build();

	}

	build() {

		// Create InstancedMesh

		const { instances } = this;
		//this.noise = Array.from( { length: instances }, () => random.amount() );

		const innerRadius = 0.6;
		const outerRadius = innerRadius * 1.2;
		const thetaSegments = 6;
		const geometry = new RingGeometry( innerRadius, outerRadius, thetaSegments );
		geometry.rotateX( MathUtils.degToRad( - 90 ) );

		const material = new MeshBasicMaterial( {
			color: 0x62adfe,
			transparent: true,
		} );
		material.onBeforeCompile = this.editShader.bind( this );

		this.mesh = new InstancedMesh( geometry, material, instances );
		this.add( this.mesh );

		this.instance = new Object3D(); // For instanceMatrix updates

		// Fill instance matrix

		this.x = new Float32Array( instances );
		this.y = - 5;
		this.z = new Float32Array( instances );

		this.progress = new Float32Array( instances );

		this.originZ = this.y * 2;

		this.aspectNeedsUpdate = true;
		this.updateAspect();
		this.aspectNeedsUpdate = false;

		this.random = new Vesuna();

		for ( let i = 0; i < instances; i ++ ) {

			this.randomPositionInstance( i );

			const scale = this.random.amount();
			this.instance.scale.set( scale, scale, scale );
			this.progress[ i ] = scale;

			this.instance.updateMatrix();
			this.mesh.setMatrixAt( i, this.instance.matrix );

		}

		geometry.setAttribute(
			'aProgress',
			new InstancedBufferAttribute( this.progress, 1 )
		);

		this.mesh.instanceMatrix.setUsage( DynamicDrawUsage );

	}

	updateAspect( width = window.innerWidth, height = window.innerHeight ) {

		if ( ! this.aspectNeedsUpdate ) return this.aspectNeedsUpdate = true;

		this.aspect = width / height;

		this.maxCount = ( this.aspect < 1 )
			? Math.round( this.instances * this.aspect )
			: this.instances;

		this.depth = this.stage.getVisibleWidth( this.originZ ) * 1.2;
		this.width = this.depth * this.aspect;

	}

	randomPositionInstance( i ) {

		const angle = this.random.number( 0, 2 * Math.PI );

		this.instance.position.set(
			Math.cos( angle ) * this.random.amount() * this.width,
			this.y,
			Math.sin( angle ) * this.random.amount() * this.depth + this.originZ
		);

		this.x[ i ] = this.instance.position.x;
		this.z[ i ] = this.instance.position.z;

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

	init( renderer ) {

		super.init( renderer );

		this.effects.add( 'bloom', new DitheredUnrealBloomPass( {
			strength: 0.62,
			radius: 0.5,
			threshold: 0.33,
		} ) );

		this.controls = new RainSketchControls( this, {
			gui: false,
		} );

	}

	resize( width, height, pixelRatio ) {

		this.updateAspect( width, height );

		super.resize( width, height, pixelRatio );

	}

	tick() {

		const progressArray = this.mesh.geometry.attributes.aProgress.array;

		for ( let i = 0; i < this.mesh.count; i ++ ) {

			let progress = progressArray[ i ] + this.speed;
			if ( progress > 1 ) {

				progress = 0;
				this.randomPositionInstance( i );

			} else {

				this.instance.position.set( this.x[ i ], this.y, this.z[ i ] );

			}

			this.instance.scale.set( progress, progress, progress );

			this.instance.updateMatrix();
			this.mesh.setMatrixAt( i, this.instance.matrix );

			progressArray[ i ] = progress;

		}

		this.mesh.instanceMatrix.needsUpdate = true;
		this.mesh.geometry.attributes.aProgress.needsUpdate = true;

		this.controls.tick();
		super.tick();

	}

}

export { RainSketch };
