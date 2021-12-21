import { Vector3 } from 'three';

class CameraLerper {

	constructor( camera, {
		lookAt = new Vector3( 0, 0, 0 ),
		bounds = new Vector3( 5, 5, 0 ),
		speed = 0.02,
	} = {} ) {

		this.camera = camera;

		this.lookAt = lookAt;
		this.bounds = bounds;
		this.speed = speed;

		this.target = new Vector3();
		this.origin = new Vector3().copy( camera.position );

	}

	update( x = 0, y = 0, z = 0 ) {

		this.target.x = this.origin.x + this.bounds.x * x;
		this.target.y = this.origin.y + this.bounds.y * y;
		this.target.z = this.origin.z + this.bounds.z * z;

		this.camera.position.lerp( this.target, this.speed );
		this.camera.lookAt( this.lookAt );

	}

}

export { CameraLerper };
