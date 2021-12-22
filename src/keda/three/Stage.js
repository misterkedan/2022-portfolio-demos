import { PerspectiveCamera, Scene, Vector3 } from 'three';

class Stage {

	constructor( {
		background,
		camera = new PerspectiveCamera(),
		cameraStart = new Vector3( 10, 10, 10 ),
		cameraLookAt = new Vector3( 0, 0, 0 ),
	} = {} ) {

		this.scene = new Scene();
		if ( background ) this.scene.background = background;

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

	resize( width, height ) {

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

	}

	// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269

	getVisibleHeight( depth = 0 ) {

		const cameraDepth = this.camera.position.z;
		const offset = ( depth < cameraDepth ) ? - cameraDepth : cameraDepth;
		depth += offset;

		const verticalFOV = this.camera.fov * Math.PI / 180;
		return 2 * Math.tan( verticalFOV / 2 ) * Math.abs( depth );

	}

	getVisibleWidth( depth = 0 ) {

		return this.getVisibleHeight( depth ) * this.camera.aspect;

	}

}

export { Stage };
