import { Sketch } from 'keda/three/Sketch';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { FXAAPass } from 'keda/three/postprocessing/FXAAPass';
import { BoxGeometry } from 'three';
import { EdgesGeometry } from 'three';
import { LineBasicMaterial } from 'three';
import { LineSegments } from 'three';
import { InstancedBufferGeometry } from 'three';
import { Float32BufferAttribute } from 'three';
import { InstancedBufferAttribute } from 'three';
import simplex3D from 'keda/glsl/simplex3D.glsl';
import { Vector3 } from 'three';
import { BlockflowSettings } from './BlockflowSettings';
import { BlockflowControls } from './BlockflowControls';

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

		const { settings } = this;

		const { tile } = settings;
		tile.width = settings.bounds.x / tile.countX;
		tile.depth = settings.bounds.z / tile.countZ;

		const box = new BoxGeometry( tile.width, tile.height, tile.depth );
		const instances = tile.countX * tile.countZ;
		if ( settings.debug ) console.log( { instances } );

		const edges = new EdgesGeometry( box );
		const positions = new Float32Array( edges.attributes.position.array );

		const attributeCount = 3 * instances;
		const offsets = new Float32Array( attributeCount );

		let tileX = 0;
		let tileZ = 0;
		let offsetX = - ( tile.countX * tile.width - tile.width ) / 2;
		let offsetY = - tile.height;
		let offsetZ = - ( tile.countZ * tile.depth - tile.depth ) / 2;

		for ( let i = 0; i < attributeCount; i += 3 ) {

			offsets[   i   ] = offsetX + tileX * tile.width;
			offsets[ i + 1 ] = offsetY;
			offsets[ i + 2 ] = offsetZ + tileZ * tile.depth;

			tileX = ( tileX + 1 ) % tile.countX;
			if ( tileX === 0 ) tileZ ++;

		}

		const geometry = new InstancedBufferGeometry();
		geometry.instanceCount = instances;
		geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'aOffset', new InstancedBufferAttribute( offsets, 3 ) );

		const material = new LineBasicMaterial( settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		this.grid = new LineSegments( geometry, material );
		this.add( this.grid );

		this.shader = {
			uniforms: {
				uCursor: { value: null },
				uTime: { value: 0 },
			},
		};

	}

	editShader( shader ) {

		Object.assign( shader.uniforms, this.shader.uniforms );

		const tokenA = '#include <common>';
		const insertA = /*glsl*/`
			attribute vec3 aOffset;
			uniform float uTime;
			uniform vec3 uCursor;
			${simplex3D}
			//mat3 scale( float x, float y, float z ) {
			//	return mat3(
			//		vec3(  x , 0.0, 0.0 ),
			//		vec3( 0.0,  y , 0.0 ),
			//		vec3( 0.0, 0.0,  z  )
			//	);
			//}
		`;
		shader.vertexShader = shader.vertexShader.replace(
			tokenA,
			tokenA + insertA
		);

		const tokenB = '#include <begin_vertex>';
		const insertB = /*glsl*/`
			transformed += aOffset;

			float distanceToCursor = length( uCursor - aOffset );
			float force = - 6.18 / distanceToCursor;
			float yScale = position.y * clamp(
				simplex3D( 
					aOffset.x * 0.015, 
					distanceToCursor * 0.1 - uTime,
					aOffset.z * 0.015
				) * force * 40.0, 
				-30.0,  
				30.0
			) * 40.0;

			transformed.y *= yScale;
			
		`;
		shader.vertexShader = shader.vertexShader.replace(
			tokenB,
			tokenB + insertB
		);

		this.shader = shader;

	}

	tick( delta, time ) {

		this.shader.uniforms.uTime.value = time * this.settings.speed.value;

		super.tick( delta );

	}

}

export { BlockflowSketch };
