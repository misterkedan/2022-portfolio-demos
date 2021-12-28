import { Vector2 } from 'three';
import { Vector3 } from 'three';

class CameraBounds {

	constructor( camera, fixedCamera = false ) {

		if ( fixedCamera ) this.camera = camera;
		else {

			this.camera = camera.clone();
			this.camera.position.set( 0, 0, 0 );
			this.camera.lookAt( 0, 0, 0 );
			this.camera.updateProjectionMatrix();
			this.camera.updateMatrixWorld();

		}

		this.fixedCamera = fixedCamera;

		this.x = new Vector2();
		this.y = new Vector2();
		this.z = new Vector2();

	}

	update( scale = 1 ) {

		const min = - scale;
		const max = scale;

		this.near = this.unproject( 0, 0, min ).z;
		this.far = this.unproject( 0, 0, max ).z;

		const leftBottom = this.unproject( min, min, max );
		this.left = leftBottom.x;
		this.bottom = leftBottom.y;

		const rightTop = this.unproject( max, max, max );
		this.right = rightTop.x;
		this.top = rightTop.y;

		this.width = this.right - this.left;
		this.height = this.top - this.bottom;
		this.depth = this.near - this.far;

		this.x.set( this.left, this.width );
		this.y.set( this.bottom, this.height );
		this.z.set( this.far, this.depth );

		this.needsUpdate = false;

	}

	unproject( x, y, z ) {

		return new Vector3( x, y, z ).unproject( this.camera );

	}

}

export { CameraBounds };
