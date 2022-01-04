import { BoxGeometry, EdgesGeometry, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, LineBasicMaterial, LineSegments, PlaneGeometry } from 'three';

import { Sketch } from 'keda/three/Sketch';
import { CameraBounds } from '../../keda/three/misc/CameraBounds';

import { BackgridControls } from './BackgridControls';
import { BackgridSettings } from './BackgridSettings';

class Backgrid extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BackgridSettings, settings } );

		this.bounds = new CameraBounds(
			this.camera, - 1, - 3,
		);

	}

	init() {

		super.init( BackgridControls );

	}

	build() {

		const { settings } = this;

		const boxSize = 0.022;
		const boxMargin = 0.14;
		const boxSpacing = boxSize + boxMargin;


		const box = new PlaneGeometry( boxSize, boxSize );
		const edges = new EdgesGeometry( box );

		//const dotCount = 1024; // 32 * 32;

		const size = 128;
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

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = dotCount;
		geometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( edges.attributes.position )
		);
		geometry.setAttribute(
			'aOffset',
			new InstancedBufferAttribute( offsets, 3 )
		);

		const material = new LineBasicMaterial( settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		const dots = new LineSegments( geometry, material );
		dots.position.z = - 5;
		this.add( dots );
		this.dots = dots;

	}

	editShader( shader ) {

		// THREE tokens ( r136 )

		const common = '#include <common>';
		const beginVertex = '#include <begin_vertex>';
		//const diffuseColor = 'vec4 diffuseColor = vec4( diffuse, opacity )';

		// Vertex

		const vertexDeclarations = /*glsl*/`
			attribute vec3 aOffset;
		`;
		const vertexChanges = /*glsl*/`
			transformed += aOffset;
		`;

		//const fragmentDeclarations = /*glsl*/`

		//`;
		//const fragmentChanges = /*glsl*/`

		//`;

		// Apply

		shader.vertexShader = shader.vertexShader.replace(
			common,
			common + vertexDeclarations
		);
		shader.vertexShader = shader.vertexShader.replace(
			beginVertex,
			beginVertex + vertexChanges
		);
		//shadeBackragmentShader = shader.fragmentShader.replace(
		//	common,
		//	common + fragmentDeclarations
		//);
		//shader.fragmentShader = shader.fragmentShader.replace(
		//	diffuseColor,
		//	fragmentChanges
		//);

		//Object.assign( shader.uniforms, this.shader.uniforms );

		this.shader = shader;

	}


}

export { Backgrid };
