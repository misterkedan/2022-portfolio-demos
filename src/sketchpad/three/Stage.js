import { Color, PerspectiveCamera, Scene, Vector3 } from 'three';

class Stage {

	constructor( {
		background = new Color( 0x808080 ),
		camera = new PerspectiveCamera(),
		cameraStart = new Vector3( 10, 10, 10 ),
		cameraLookAt = new Vector3( 0, 0, 0 ),
	} = {} ) {

		this.scene = new Scene();
		this.scene.background = background;

		this.camera = camera;
		camera.position.copy( cameraStart );
		camera.lookAt( cameraLookAt );

	}

	add( object3D ) {

		this.scene.add( object3D );

	}

	remove( object3D ) {

		this.scene.remove( object3D );

	}

	resize( width = window.innerWidth, height = window.innerHeight ) {

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

	}

}

export { Stage };
