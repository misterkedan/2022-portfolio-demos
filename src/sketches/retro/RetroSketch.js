import RetroSettings from './RetroSettings';
import { RetroControls } from './RetroControls';
import GPGPU_y_shader from './glsl/GPGPU_y.frag';
import GPGPU_z_shader from './glsl/GPGPU_z.frag';

import { Sketch } from 'keda/three/Sketch';
import { LinearGradient } from 'keda/three/misc/LinearGradient';
import { BloomPass } from 'keda/three/postprocessing/BloomPass';
import { GPGPU } from 'keda/three/gpgpu/GPGPU';
import { toVector3 } from 'keda/three/utils/Utils';

import { LineBasicMaterial } from 'three';
import { LineSegments } from 'three';
import { BufferGeometry } from 'three';
import { BufferAttribute } from 'three';
import { PointsMaterial } from 'three';
import { Points } from 'three';

class RetroSketch extends Sketch {

	constructor( settings = {} ) {

		settings = { ...RetroSettings, ...settings };

		const cameraStart = toVector3( settings.cameraStart );
		const cameraLookAt = toVector3( settings.cameraLookAt );

		super( { cameraStart, cameraLookAt } );

		this.stage.camera.far = 50;

		this.background = new LinearGradient( settings.background );
		this.add( this.background );

		this.settings = settings;

	}

	build() {

		const { tilesX, tilesZ } = this.settings;

		const tileWidth = 0.4;
		const tileDepth = 0.4;
		const width = tilesX * tileWidth;
		const depth = tilesZ * tileDepth;
		const offsetX = - width / 2;
		const offsetZ = 5 - depth;

		const pointsX = tilesX + 1;
		const pointsZ = tilesZ + 1;

		const tiles = tilesX * tilesZ;
		const points = pointsX * pointsZ;
		const vertices = tiles * 8;

		const positions = new Float32Array( vertices * 3 );
		const targets = new Float32Array( vertices * 2 );

		this.GPGPU = new GPGPU( points );
		const { textureSize } = this.GPGPU;

		// Compute tiles

		const positionsX = new Float32Array( points );
		const positionsZ = new Float32Array( points );
		const targetsX = new Float32Array( points );
		const targetsZ = new Float32Array( points );
		let positionX = 0;
		let positionZ = 0;
		let targetX = 0;
		let targetZ = 0;
		let pointX = 0;
		let pointZ = 0;

		for ( let point = 0; point < points; point ++ ) {

			positionsX[ positionX ++ ] = offsetX + tileWidth * pointX;
			positionsZ[ positionZ ++ ] = offsetZ + tileDepth * pointZ;

			targetsX[ targetX ++ ] = ( point % textureSize ) / textureSize;
			targetsZ[ targetZ ++ ] = ~ ~ ( point / textureSize ) / textureSize;

			pointX = ( pointX + 1 ) % pointsX;
			if ( pointX === 0 ) pointZ ++;

		}

		// Fill geometry

		let position = 0;
		let target = 0;
		let tileX = 0;
		let tileZ = 0;

		pointX = 0;
		pointZ = 0;

		let backLeft, backRight, frontLeft, frontRight;

		const addVertex = ( index ) => {

			positions[ position ++ ] = positionsX[ index ];
			positions[ position ++ ] = 0;
			positions[ position ++ ] = positionsZ[ index ];
			targets[ target ++ ] = targetsX[ index ];
			targets[ target ++ ] = targetsZ[ index ];

		};

		const addLine = ( a, b ) => {

			addVertex( a );
			addVertex( b );

		};

		for ( let tile = 0; tile < tiles; tile ++ ) {

			backLeft = tile + tileZ;
			backRight = backLeft + 1;
			frontLeft = tile + pointsX + tileZ;
			frontRight = frontLeft + 1;

			addLine( backLeft, backRight );
			addLine( backRight, frontRight );
			addLine( frontRight, frontLeft );
			addLine( frontLeft, backLeft );

			tileX = ( tileX + 1 ) % tilesX;
			if ( tileX === 0 ) tileZ ++;

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'GPGPU_target', new BufferAttribute( targets, 2 ) );

		// Lines

		const material = new LineBasicMaterial( this.settings.material );
		material.onBeforeCompile = this.editShader.bind( this );

		const lines = new LineSegments( geometry, material );
		this.add( lines );

		// Particles

		//const particlesMaterial = new PointsMaterial( {
		//	size: 0.01, color: 0x0099ff
		//} );
		//particlesMaterial.onBeforeCompile = this.editShader.bind( this );

		//const particles = new Points( geometry, particlesMaterial );
		//this.add( particles );

		// GPGPU

		this.GPGPU.addConstant( 'startX', positionsX );
		this.GPGPU.addConstant( 'startZ', positionsX );

		this.GPGPU.addVariable( 'y', {
			shader: GPGPU_y_shader,
			uniforms: {
				uTime: { value: 0 },
				GPGPU_startX: { value: this.GPGPU.startX },
				GPGPU_startZ: { value: this.GPGPU.startZ },
			}
		} );

		this.GPGPU.addVariable( 'z', {
			data: positionZ,
			shader: GPGPU_z_shader,
			uniforms: {
				uTime: { value: 0 },
			}
		} );

		if ( this.settings.debug ) console.log( { points, tiles } );

	}

	editShader( shader ) {

		//shader.uniforms.GPGPU_x = { value: this.GPGPU.x };
		shader.uniforms.GPGPU_y = { value: this.GPGPU.y };
		shader.uniforms.GPGPU_z = { value: this.GPGPU.z };

		const insertA = /*glsl*/`
		attribute vec2 GPGPU_target;
		uniform sampler2D GPGPU_y;
		uniform sampler2D GPGPU_z;
		${ GPGPU.FloatPack.glsl }
		`;
		const tokenA = '#include <common>';
		shader.vertexShader = shader.vertexShader.replace(
			tokenA,
			tokenA + insertA,
		);

		const insertB = /*glsl*/`
			transformed.y += unpackFloat( texture2D( GPGPU_y, GPGPU_target ) );
			transformed.z += unpackFloat( texture2D( GPGPU_z, GPGPU_target ) );
		`;
		const tokenB = '#include <begin_vertex>';
		shader.vertexShader = shader.vertexShader.replace(
			tokenB,
			tokenB + insertB
		);

		this.shader = shader;

	}

	init( sketchpad ) {

		super.init( sketchpad );
		this.effects.add( 'bloom', new BloomPass( this.settings.bloom ) );

		GPGPU.init( sketchpad.renderer );

		this.build();
		this.controls = new RetroControls( this );

	}

	tick( time ) {

		this.GPGPU.setUniform( 'y', 'uTime', time );
		this.GPGPU.setUniform( 'z', 'uTime', time );
		this.GPGPU.tick();

		this.controls.tick();
		super.tick();

	}

}

export { RetroSketch };
