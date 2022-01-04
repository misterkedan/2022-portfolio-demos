import { Controls } from 'keda/three/Controls';

class BackgridControls extends Controls {

	constructor( sketch ) {

		super( sketch, { cameraRig: false } );

	}

	initGUI() {

		const { sketch } = this;
		const { settings, background } = sketch;

		const gui = new Controls.GUI( { title: settings.name.toUpperCase() } );

		const colors = gui.addFolder( 'Colors' );
		colors.addColor( background, 'color1' ).name( 'background1' );
		colors.addColor( background, 'color2' ).name( 'background2' );
		colors.addColor( sketch.dots.material, 'color' );

		if ( window.innerWidth < Controls.GUI_MINIFY_BREAKPOINT ) gui.close();
		this.gui = gui;

	}

}

export { BackgridControls };
