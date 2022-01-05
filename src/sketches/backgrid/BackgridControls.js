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

		//this.origin = new Vector3( 0, 0, 0 );
		this.intensity = 0.5;
		this.initRaycaster();

	}

	initRaycaster() {

		const { settings } = this.sketch;

		this.raycaster = new Raycaster();
		this.hitbox = new Mesh(
			new PlaneGeometry( this.sketch.size, this.sketch.size, 100, 100 ),
			new MeshBasicMaterial( settings.hitbox.material )
		);
		//this.hitbox.position.z = - 5;
		//this.hitbox.rotateX( - Math.PI / 2 );
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
		const { settings, background } = sketch;

		const gui = new Controls.GUI( { title: settings.name.toUpperCase() } );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( background, 'color1' ).name( 'background1' );
		colors.addColor( background, 'color2' ).name( 'background2' );
		colors.addColor( sketch, 'color' );
		colors.addColor( sketch, 'activeColor' );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
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

		const lerpSpeed = 0.05;
		const targetIntensity = ( sketch.camera.aspect > 1 )
			? tracker.reverseCenterX
			: tracker.reverseCenterY
		;
		this.intensity = lerp( this.intensity, targetIntensity, lerpSpeed );

		sketch.depth.value = lerp( 0.5, 0.1, this.intensity );
		sketch.scale.value = lerp( 0.1, 1, this.intensity );

	}

}

export { BackgridControls };
