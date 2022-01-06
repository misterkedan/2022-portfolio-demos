import {
	BoxGeometry,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Raycaster,
	Vector2,
} from 'three';

class CursorProjector {

	constructor( sketch, {

		plane,
		width = 1000,
		height = 1000,
		horizontal = false,

		cursor,
		cursorSize = 0.1,

		color = 0xff0000,
		opacity = 0.15,

		lerp,
		autoRotate,

	} = {} ) {

		if ( ! plane ) {

			plane = new Mesh(
				new PlaneGeometry( width, height ),
				new MeshBasicMaterial( {
					color,
					opacity,
					transparent: ( opacity < 1 )
				} ),
			);

			if ( horizontal ) plane.rotateX( - Math.PI / 2 );

		}

		if ( ! cursor ) cursor = new Mesh(
			new BoxGeometry( cursorSize, cursorSize, cursorSize ),
			new MeshBasicMaterial( { color } )
		);

		sketch.add( plane );
		sketch.add( cursor );
		this.plane = plane;
		this.cursor = cursor;

		this.lerp = lerp;
		this.autoRotate = autoRotate;

		this.camera = sketch.camera;
		this.tracker = new Vector2();
		this.raycaster = new Raycaster();

		if ( ! sketch.debug ) {

			this.plane.visible = false;
			this.cursor.visible = false;

		}

	}

	set( x, y ) {

		this.tracker.set( x, y );

	}

	tick( delta ) {

		if ( this.autoRotate )
			this.plane.quaternion.copy( this.camera.quaternion );

		this.raycaster.setFromCamera( this.tracker, this.camera );
		const intersection = this.raycaster.intersectObject( this.plane )[ 0 ];
		if ( ! intersection?.point ) return;

		if ( ! this.lerp ) return this.cursor.position.copy( intersection.point );

		const lerpSpeed = MathUtils.clamp( this.lerp * delta, 0, 1 );
		this.cursor.position.lerp( intersection.point, lerpSpeed );

	}

}

export { CursorProjector };
