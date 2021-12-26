import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Raycaster
} from 'three';
import { Controls } from 'keda/three/Controls';
import { Vector3 } from 'three';


class BlockflowControls extends Controls {

	constructor( sketch ) {

		super( sketch );

		this.raycaster = new Raycaster();
		this.hitbox = new Mesh(
			new PlaneGeometry( 50, 50 ),
			new MeshBasicMaterial( {
				color: 'red', opacity: 0.25, transparent:true  } )
		);
		this.hitbox.rotateX( - Math.PI / 2 );
		sketch.add( this.hitbox );

		const cursorSize = 1;
		this.cursor = new Mesh(
			new BoxGeometry( cursorSize, cursorSize, cursorSize ),
			new MeshBasicMaterial( { color: 'red', wireframe: true } )
		);
		sketch.add( this.cursor );
		this.cursor.tracker = new Vector3();

		this.hitbox.visible = false;
		this.cursor.visible = false;

		this.cameraLerper.speed = 0.001;
		this.tracker.x = 0.1;
		this.tracker.y = 0.2;

	}

	initGUI() {

		const { sketch } = this;

		const gui = new Controls.GUI( { title: sketch.settings.title } );
		const colors = gui.addFolder( 'Colors' );

		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.grid.material, 'color' );

		const bloom = gui.addFolder( 'Bloom' );
		bloom.add( sketch.effects.passes.bloom, 'strength', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'radius', 0, 1 );
		bloom.add( sketch.effects.passes.bloom, 'threshold', 0, 1 );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
		this.gui = gui;

	}

	tick( delta ) {

		super.tick( delta );

		const { tracker, cursor, hitbox, raycaster } = this;
		const { camera } = this.sketch.stage;

		cursor.tracker.set( tracker.polarizeX, tracker.reversePolarizeY );
		this.raycaster.setFromCamera( cursor.tracker, camera );
		const intersection = raycaster.intersectObjects( [ hitbox ] )[ 0 ];
		if ( intersection ) cursor.position.copy( intersection.point );

	}

}

export { BlockflowControls };
