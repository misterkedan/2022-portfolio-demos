import {
	BoxGeometry,
	EdgesGeometry,
	LineBasicMaterial,
	LineSegments,
	InstancedBufferGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute
} from 'three';

import { Sketch } from 'keda/three/Sketch';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { FXAAPass } from 'keda/three/postprocessing/FXAAPass';
import simplex3D from 'keda/glsl/simplex3D.glsl';

import { BlockflowSettings } from './BlockflowSettings';
import { BlockflowControls } from './BlockflowControls';
import { PlaneGeometry } from 'three';

class BlockflowSketch extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BlockflowSettings, settings } );

	}

	init() {

		this.build();

		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		this.controls = new BlockflowControls( this );
		this.shader.uniforms.uCursor.value = this.controls.cursor.position;

	}

	build() {

		// Computations

		const { settings } = this;
		const { tile } = settings;
		const instances = tile.countX * tile.countZ;

		const netWidth = tile.width + tile.margin.x;
		const netDepth = tile.depth + tile.margin.z;
		const totalWidth = netWidth * tile.countX - tile.margin.x;
		const totalDepth = netDepth * tile.countZ - tile.margin.z;

		const offsetX = - ( totalWidth - tile.width ) / 2;
		const offsetY = - tile.height * 0.5;
		const offsetZ = - ( totalDepth - tile.depth ) / 2;

		if ( settings.debug ) console.log( { instances } );

		// Geometry

		const box = new BoxGeometry( tile.width, tile.height, tile.depth );
		const edges = new EdgesGeometry( box );

		const positions = new Float32Array( edges.attributes.position.array );
		const attributeCount = 3 * instances;
		const offsets = new Float32Array( attributeCount );

		let tileX = 0;
		let tileZ = 0;

		for ( let i = 0; i < attributeCount; i += 3 ) {

			offsets[   i   ] = offsetX + tileX * netWidth;
			offsets[ i + 1 ] = offsetY;
			offsets[ i + 2 ] = offsetZ + tileZ * netDepth;

			tileX = ( tileX + 1 ) % tile.countX;
			if ( tileX === 0 ) tileZ ++;

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = instances;
		geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'aOffset', new InstancedBufferAttribute( offsets, 3 ) );

		// Material

		const material = new LineBasicMaterial( settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		this.shader = {
			uniforms: {
				uCursor: { value: null },
				uTime: { value: 0 },
			},
		};

		// Grid

		this.grid = new LineSegments( geometry, material );
		this.add( this.grid );

		// Border

		const plane = new PlaneGeometry(
			totalWidth + settings.border.margin,
			totalDepth + settings.border.margin,
		);
		plane.rotateX( - Math.PI / 2 );
		this.border = new LineSegments( new EdgesGeometry( plane ), material );
		this.add( this.border );

		// Cleanup

		box.dispose();
		edges.dispose();

	}

	editShader( shader ) {

		// THREE tokens ( r135 )

		const common = '#include <common>';
		const beginVertex = '#include <begin_vertex>';
		const diffuseColor = 'vec4 diffuseColor = vec4( diffuse, opacity )';

		// Vertex

		const vertexDeclarations = /*glsl*/`
			attribute vec3 aOffset;
			uniform float uTime;
			uniform vec3 uCursor;
			varying float vHeight;
			${simplex3D}
			float integralSmoothstep( float x, float T ) {
    			if( x>T ) return x - T/2.0;
    			return x*x*x*(1.0-x*0.5/T)/T/T;
			}
		`;

		const vertexChanges = /*glsl*/`
			transformed += aOffset;

			float distanceToCursor = length( uCursor - aOffset );
			float force = - 1.0 / ( 1.618 + sqrt( distanceToCursor ) );

			float waves = simplex3D(
				aOffset.x * 0.01, 
				distanceToCursor * 0.1 - uTime,
				aOffset.z * 0.01
			) * force * 8.0;

			float turbulence = simplex3D(
				aOffset.x * 0.5,
				aOffset.z * 0.5,
				uTime
			) * 1.0;

			float noise = abs ( 1.0 + waves + turbulence );

			transformed.y *= position.y * noise * 200.0;

			vHeight = transformed.y;
		`;

		// Fragment

		const fragmentDeclarations = /*glsl*/`

			varying float vHeight;

		`;

		const fragmentChanges = /*glsl*/`

			vec4 diffuseColor = vec4( 
				mix( diffuse, vec3( 0.7, 1.0, 0.0), vHeight ), 
				opacity
			);

		`;

		// Apply changes

		shader.vertexShader = shader.vertexShader.replace(
			common,
			common + vertexDeclarations
		);
		shader.vertexShader = shader.vertexShader.replace(
			beginVertex,
			beginVertex + vertexChanges
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			common,
			common + fragmentDeclarations
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			diffuseColor,
			fragmentChanges
		);

		Object.assign( shader.uniforms, this.shader.uniforms );

		this.shader = shader;

	}

	tick( delta, time ) {

		this.shader.uniforms.uTime.value = time * this.settings.speed.value;

		super.tick( delta );

	}

}

export { BlockflowSketch };
