import {
	Color,
	EdgesGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineBasicMaterial,
	LineSegments,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Uint16BufferAttribute,
	Uniform,
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { CameraBounds } from 'keda/three/misc/CameraBounds';
import { editBasicMaterialShader } from 'keda/three/misc/Utils';
import { GPGPU } from 'keda/three/gpgpu/GPGPU';

import { BackgridControls } from './BackgridControls';
import { BackgridSettings } from './BackgridSettings';
import { BackgridGLSL } from './BackgridGLSL';

class Backgrid extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BackgridSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera, - 1, - 3,
		);



	}

	init() {

		super.init( BackgridControls );

		this.cursor.value = this.controls.cursor.position;

	}

	build() {

		const { settings } = this;

		const boxSize = 0.04;
		const boxMargin = 0.3;
		const boxSpacing = boxSize + boxMargin;

		const size = 64;
		const dotCount = size * size;
		const offsets = new Float32Array( dotCount * 3 );
		const offsetsX = new Float32Array( dotCount );
		const offsetsY = new Float32Array( dotCount );
		const targets = new Float32Array( dotCount * 2 );

		const totalSize = boxSpacing * size;
		const startX = ( boxSpacing - totalSize ) / 2;
		const startY = - ( boxSpacing - totalSize ) / 2;

		let i = 0;
		let t = 0;
		let o = 0;

		for ( let row = 0; row < size; row ++ ) {

			for ( let column = 0; column < size; column ++ ) {

				const x = startX + column * boxSpacing;
				const y = startY - row * boxSpacing;

				offsetsX[ i ] = x;
				offsetsY[ i ] = y;

				offsets[ o ++ ] = x;
				offsets[ o ++ ] = y;
				offsets[ o ++ ] = 0;

				targets[ t ++ ] = ( i % size ) / size;
				targets[ t ++ ] = ~ ~ ( i / size ) / size;

				i ++;

			}

		}

		const box = new PlaneGeometry( boxSize, boxSize );
		const edges = new EdgesGeometry( box );

		const coreGeometry = new InstancedBufferGeometry();
		coreGeometry.instanceCount = dotCount;
		coreGeometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( box.attributes.position )
		);
		coreGeometry.setIndex(
			new Uint16BufferAttribute().copy( box.index )
		);
		coreGeometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute( offsets, 3 )
		);
		coreGeometry.setAttribute(
			'GPGPU_target',
			new InstancedBufferAttribute( targets, 2 )
		);

		const coreMaterial = new MeshBasicMaterial( settings.material );
		coreMaterial.onBeforeCompile = this.editCoreShader.bind( this );

		const cores = new Mesh( coreGeometry, coreMaterial );
		this.add( cores );
		this.cores = cores;

		// Shells

		const shellScale = 2;
		edges.scale( shellScale, shellScale, shellScale );

		const shellGeometry = new InstancedBufferGeometry();
		shellGeometry.instanceCount = dotCount;
		shellGeometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( edges.attributes.position )
		);
		shellGeometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute( offsets, 3 )
		);
		shellGeometry.setAttribute(
			'GPGPU_target',
			new InstancedBufferAttribute( targets, 2 )
		);

		const shellMaterial = new LineBasicMaterial( settings.material );
		shellMaterial.onBeforeCompile = this.editShellShader.bind( this );

		const shells = new LineSegments( shellGeometry, shellMaterial );
		this.add( shells );
		this.shells = shells;

		// Wrap-up

		box.dispose();
		edges.dispose();

		this.size = totalSize;

		this.initGPGPU( offsetsX, offsetsY );

	}

	initGPGPU( offsetsX, offsetsY ) {

		//const { settings } = this;

		this.activeColor = new Color( this.settings.activeColor );
		this.color = new Color( this.settings.material.color );
		this.cores.material.color = this.color;
		this.shells.material.color = this.color;

		this.cursor = new Uniform();
		this.time = new Uniform( 0 );
		this.delta = new Uniform( 0 );
		this.scale = new Uniform( 0.2 );

		GPGPU.init( this.sketchpad.renderer );

		const gpgpu = new GPGPU( 64 * 64 );

		gpgpu.addConstant( 'offsetX', offsetsX );
		gpgpu.addConstant( 'offsetY', offsetsY );

		gpgpu.addVariable( 'intensity', {
			shader: BackgridGLSL.GPGPU_intensity,
			uniforms: {
				GPGPU_offsetX: gpgpu.offsetX,
				GPGPU_offsetY: gpgpu.offsetY,
				uCursor: this.cursor,
				uDelta: this.delta,
				uScale: this.scale,
				uTime: this.time,
			}
		} );

		this.gpgpu = gpgpu;

		this.uniforms = {
			GPGPU_intensity: gpgpu.intensity,
			uActiveColor: new Uniform( this.activeColor ),
		};

	}

	editCoreShader( shader ) {

		editBasicMaterialShader(
			shader,
			BackgridGLSL.core.vertexHead,
			BackgridGLSL.core.vertexBody,
			BackgridGLSL.core.fragmentHead,
			BackgridGLSL.core.fragmentBody
		);

		Object.assign( shader.uniforms, this.uniforms );
		this.coreShader = shader;

	}

	editShellShader( shader ) {

		editBasicMaterialShader(
			shader,
			BackgridGLSL.shell.vertexHead,
			BackgridGLSL.shell.vertexBody,
			BackgridGLSL.shell.fragmentHead,
			BackgridGLSL.shell.fragmentBody
		);

		Object.assign( shader.uniforms, this.uniforms );
		this.shellShader = shader;

	}

	tick( delta ) {

		this.delta.value = delta * 0.003;
		this.time.value += delta * 0.0003;

		this.gpgpu.tick();

		// Test scroll
		//this.cores.position.y = ( this.cores.position.y + 0.01 ) % 0.34;
		//this.shells.position.copy( this.cores.position );

		// Test ranges
		//this.max = 0;
		//this.min = 0;
		//const data = this.gpgpu.variables.intensity.read();
		//this.max = data.reduce( ( acc, value ) => {
		//	if ( value > acc ) acc = value;
		//	return acc;
		//}, this.max );
		//this.min = data.reduce( ( acc, value ) => {
		//	if ( value < acc ) acc = value;
		//	return acc;
		//}, this.min );
		//console.log( { min: this.min, max: this.max } );

		super.tick( delta );

	}

}

export { Backgrid };
