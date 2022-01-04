import { BoxGeometry, EdgesGeometry, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, InstancedMesh, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PlaneGeometry, Uint16BufferAttribute } from 'three';

import { Sketch } from 'keda/three/Sketch';
import { CameraBounds } from 'keda/three/misc/CameraBounds';
import { editBasicMaterialShader } from 'keda/three/misc/Utils';

import { BackgridControls } from './BackgridControls';
import { BackgridSettings } from './BackgridSettings';
import { Color } from 'three';
import { Uniform } from 'three';

class Backgrid extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BackgridSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera, - 1, - 3,
		);
		this.color = new Color( this.settings.material.color );
		this.cursor = new Uniform();

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

		const totalSize = boxSpacing * size;
		const startX = ( boxSpacing - totalSize ) / 2;
		const startY = - ( boxSpacing - totalSize ) / 2;

		let o = 0;

		for ( let row = 0; row < size; row ++ ) {

			for ( let column = 0; column < size; column ++ ) {

				offsets[ o ++ ] = startX + column * boxSpacing;
				offsets[ o ++ ] = startY - row * boxSpacing;
				offsets[ o ++ ] = 0;

			}

		}

		const box = new PlaneGeometry( boxSize, boxSize );

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

		const coreMaterial = new MeshBasicMaterial( settings.material );
		coreMaterial.color = this.color;
		coreMaterial.onBeforeCompile = this.editCoreShader.bind( this );

		const cores = new Mesh( coreGeometry, coreMaterial );

		this.add( cores );
		this.cores = cores;

		// Shells

		const edges = new EdgesGeometry( box );

		const shellScale = 1.2;
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

		const shellMaterial = new LineBasicMaterial( settings.material );
		shellMaterial.color = this.color;
		shellMaterial.onBeforeCompile = this.editShellShader.bind( this );

		const shells = new LineSegments( shellGeometry, shellMaterial );
		this.add( shells );
		this.shells = shells;

		// Wrap-up

		box.dispose();
		edges.dispose();

		this.size = totalSize;

		this.coreShader = {
			uniforms: {
				uCursor: this.cursor
			},
		};

		this.shellShader = {
			uniforms: {
				uCursor: this.cursor
			},
		};

	}

	editCoreShader( shader ) {

		editBasicMaterialShader(
			shader,
			/*glsl*/`
				attribute vec3 aOffset;
				uniform vec3 uCursor;
			`,
			/*glsl*/`
				transformed *= clamp( 
					pow( length( uCursor - aOffset ), 2.0 ),
					0.5,
					1.0
				);
				transformed += aOffset;
			`
		);

		Object.assign( shader.uniforms, this.coreShader.uniforms );
		this.coreShader = shader;

	}

	editShellShader( shader ) {

		editBasicMaterialShader(
			shader,
			/*glsl*/`
				attribute vec3 aOffset;
				uniform vec3 uCursor;
			`,
			/*glsl*/`
				transformed *= clamp( 
					pow( 1.0 / length( uCursor - aOffset ) + 1.0 , 2.0 ),
					1.0,
					6.0
				);
				transformed += aOffset;
			`
		);

		Object.assign( shader.uniforms, this.shellShader.uniforms );
		this.shellShader = shader;

	}

}

export { Backgrid };
