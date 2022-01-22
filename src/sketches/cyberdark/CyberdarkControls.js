import { Controls } from 'keda/three/Controls';

class CyberdarkControls extends Controls {

	constructor( sketch ) {

		super( sketch );

	}

	initGUI() {

		super.initGUI();

		const { VALUE } = Controls;
		const { gui, sketch } = this;

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( sketch.background, 'color1' ).name( 'background1' );
		colors.addColor( sketch.background, 'color2' ).name( 'background2' );

		colors.addColor( sketch.color, VALUE ).name( 'particle' );
		colors.add( sketch.opacity, VALUE, 0, 1 ).name( 'opacity' );

	}

}

export { CyberdarkControls };
