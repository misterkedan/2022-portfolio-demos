import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Raycaster,
	Vector3,
} from 'three';

import { Controls } from 'keda/three/Controls';

class BackgridControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

		this.intensity = 0;
		this.initRaycaster();

	}

	initRaycaster() {

		const { settings } = this.sketch;

		this.raycaster = new Raycaster();
		this.hitbox = new Mesh(
			new PlaneGeometry( this.sketch.totalSize, this.sketch.totalSize ),
			new MeshBasicMaterial( settings.hitbox.material )
		);
		this.sketch.add( this.hitbox );

		const { size } = settings.cursor;
		this.cursor = new Mesh(
			new BoxGeometry( size, size, size ),
			new MeshBasicMaterial( settings.cursor.material )
		);
		this.sketch.add( this.cursor );
		this.cursor.tracker = new Vector3();

		if ( this.sketch.debug ) return;
		this.hitbox.visible = false;
		this.cursor.visible = false;

	}

	initGUI() {

		const { sketch } = this;

		const gui = new Controls.GUI();

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch, 'inactiveColor' );
		colors.addColor( sketch, 'activeColor' );

		this.gui = gui;

	}

	tick( delta ) {

		const { sketch, tracker, cursor, raycaster } = this;
		const { settings } = sketch;
		const { clamp, lerp } = Controls;

		// Raycaster

		const cursorLerpSpeed = clamp( settings.cursor.lerpSpeed * delta, 0, 1 );

		cursor.tracker.set( tracker.polarizeX, tracker.reversePolarizeY );
		raycaster.setFromCamera( cursor.tracker, sketch.camera );
		const intersection = raycaster.intersectObjects( [ this.hitbox ] )[ 0 ];
		if ( intersection?.point ) cursor.position.lerp(
			intersection?.point,
			cursorLerpSpeed
		);

		// Tracker

		const targetIntensity = ( sketch.camera.aspect > 1 )
			? tracker.reverseCenterX
			: tracker.reverseCenterY
		;
		this.intensity = lerp(
			this.intensity,
			targetIntensity,
			settings.lerpSpeed
		);

		sketch.depth.value = lerp(
			settings.depth.max,
			settings.depth.min,
			this.intensity
		);

		sketch.noiseScale.value = lerp(
			settings.noiseScale.min,
			settings.noiseScale.max,
			Math.pow( this.intensity * 2.0, 2.0 )
		);

	}

}

export { BackgridControls };
