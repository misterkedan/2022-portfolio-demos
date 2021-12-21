class CursorTracker {

	constructor( {
		target = window,
		x = CursorTracker.NORMALIZE,
		y = CursorTracker.INVERT,
		width = window.innerWidth,
		height = window.innerHeight,
		margin: {
			top = 0.02,
			right = 0.02,
			bottom = 0.02,
			left = 0.02,
		} = {},
		enabled = true,
		onChange,
	} = {} ) {

		this.margin = { top, right, bottom, left };
		this.hitbox = { top, left, width, height };
		this.resize( width, height );

		this.x = 0.5;
		this.y = 0.5;

		this.modeX = x;
		this.modeY = y;
		this.onChange = onChange;

		this.target = target;
		this.onMouseMove = this.track.bind( this );
		this.onTouchMove = function ( event ) {

			event.preventDefault();
			this.track( event.targetTouches[ 0 ] );

		}.bind( this );

		if ( enabled ) this.enable();

	}

	enable() {

		if ( this._enabled ) return;
		this.target.addEventListener( 'touchmove', this.onTouchMove );
		this.target.addEventListener( 'mousemove', this.onMouseMove );
		this._enabled = true;

	}

	disable() {

		if ( ! this._enabled ) return;
		this.target.removeEventListener( 'touchmove', this.onTouchMove );
		this.target.removeEventListener( 'mousemove', this.onMouseMove );
		this._enabled = false;

	}

	dispose() {

		this.disable();

	}

	track( event ) {

		let hasChanged;

		if ( this.clientX !== event.clientX ) {

			this.clientX = event.clientX;
			this.x = this.processX( event.clientX );
			hasChanged = true;

		}

		if ( this.clientY !== event.clientY ) {

			this.clientY = event.clientY;
			this.y = this.processY( event.clientY );
			hasChanged = true;

		}

		if ( hasChanged && this.onChange ) this.onChange();

	}

	resize( width, height ) {

		const left = this.margin.left * width;
		const right = this.margin.right * width;
		this.hitbox.width = width - left - right;
		this.offsetX = left;

		const top = this.margin.top * height;
		const bottom = this.margin.bottom * height;
		this.hitbox.height = height - top - bottom;
		this.offsetY = top;

	}

	normalizeX( x ) {

		return CursorTracker.clamp( ( x - this.offsetX ) / this.hitbox.width );

	}

	normalizeY( y ) {

		return CursorTracker.clamp( ( y - this.offsetY ) / this.hitbox.height );

	}

	log() {

		console.log( { x: this.x, y: this.y } );

	}

	/*-------------------------------------------------------------------------/

		Getters & Setters

	/-------------------------------------------------------------------------*/

	get modeX() {

		return this._modeX;

	}

	set modeX( modeX ) {

		this._modeX = modeX;

		const processorsX = {
			[ CursorTracker.NORMALIZE ]: x => this.normalizeX( x ),
			[ CursorTracker.INVERT ]: x => 1 - this.normalizeX( x ),
			[ CursorTracker.SIGNED ]: x => this.normalizeX( x ) * 2 - 1,
			[ CursorTracker.SIGNED_INVERT ]:
				x => ( 1 - this.normalizeX( x ) ) * 2 - 1,
		};
		this.processX = processorsX[ modeX ];

	}

	get modeY() {

		return this._modeY;

	}

	set modeY( modeY ) {

		this._modeY = modeY;

		const processorsY = {
			[ CursorTracker.NORMALIZE ]: y => this.normalizeY( y ),
			[ CursorTracker.INVERT ]: y => 1 - this.normalizeY( y ),
			[ CursorTracker.SIGNED ]: y => this.normalizeY( y ) * 2 - 1,
			[ CursorTracker.SIGNED_INVERT ]:
				y => ( 1 - this.normalizeY( y ) ) * 2 - 1,
		};
		this.processY = processorsY[ modeY ];

	}

}

/*-----------------------------------------------------------------------------/

	Static

/-----------------------------------------------------------------------------*/

CursorTracker.NORMALIZE = 'normalize';			// 0 > 1
CursorTracker.INVERT = 'invert';				// 1 > 0
CursorTracker.SIGNED = 'signed';				// -1 > 1
CursorTracker.SIGNED_INVERT = 'signedInvert';	// 1 > -1

CursorTracker.clamp = n => n > 1 ? 1 : n < 0 ? 0 : n;

export { CursorTracker };
