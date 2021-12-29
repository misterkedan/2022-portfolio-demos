import { Vector2 } from 'three';

class CameraBounds {

	constructor( camera, near, far ) {

		this.camera = camera;
		this.near = near;
		this.far = far;
		this.depth = Math.abs( far - near );

		this.x = new Vector2();
		this.y = new Vector2();
		this.z = new Vector2();

	}

	update() {

		const height = this.getVisibleHeight( this.far );
		const width = height * this.camera.aspect;

		this.height = height;
		this.width = width;
		this.left = - width * 0.5;
		this.right = width * 0.5;
		this.top = height * 0.5;
		this.bottom = - height * 0.5;

		this.x.set( this.left, width );
		this.y.set( this.bottom, height );
		this.z.set( this.far, this.depth );

		this.needsUpdate = false;

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

export { CameraBounds };
