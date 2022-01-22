class CursorTracker {

	constructor( {
		target = window,
		width = window.innerWidth,
		height = window.innerHeight,
		margin = 0,
		marginTop, marginRight, marginBottom, marginLeft,
		enabled = true,
		debug = false,
		preventDefault = false,
		onChange,
	} = {} ) {

		const validateMargin = n => ( typeof n === 'number' && n >= 0 )
			? n
			: margin;
		this.margin = {
			top: validateMargin( marginTop ),
			right: validateMargin( marginRight ),
			bottom: validateMargin( marginBottom ),
			left: validateMargin( marginLeft ),
		};
		this.hitbox = {
			top: this.margin.top, left: this.margin.left,
			width, height
		};
		this.resize( width, height );

		this.x = this.y = 0.5;

		this.target = target;
		this.onMouseMove = function ( event ) {

			if ( preventDefault && event.preventDefault ) event.preventDefault();
			this.track( event.clientX, event.clientY );

		}.bind( this );
		this.onTouchMove = function ( event ) {

			if ( preventDefault ) event.preventDefault();
			this.onMouseMove( event.targetTouches[ 0 ] );

		}.bind( this );

		this.onChange = onChange;
		if ( debug ) this.onDebug = this.log;

		if ( enabled ) this.enable();

	}

	/*-------------------------------------------------------------------------/

		Event handling

	/-------------------------------------------------------------------------*/

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

	/*-------------------------------------------------------------------------/

		Update

	/-------------------------------------------------------------------------*/

	track( clientX, clientY ) {

		let hasChanged;

		if ( this.clientX !== clientX ) {

			this.clientX = clientX;
			const x = this.normalizeX;
			if ( this.x !== x ) {

				this.x = x;
				hasChanged = true;

			}

		}

		if ( this.clientY !== clientY ) {

			this.clientY = clientY;
			const y = this.normalizeY;
			if ( this.y !== y ) {

				this.y = y;
				hasChanged = true;

			}

		}

		if ( ! hasChanged ) return;

		this.onChange?.();
		this.onDebug?.();

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

	log() {

		const {
			x, y,
			reverseX, reverseY,
			polarizeX, polarizeY,
			reversePolarizeX, reversePolarizeY,
			centerX, centerY,
			reverseCenterX, reverseCenterY,
		} = this;

		console.log( {
			x, y,
			reverseX, reverseY,
			polarizeX, polarizeY,
			reversePolarizeX, reversePolarizeY,
			centerX, centerY,
			reverseCenterX, reverseCenterY,
		} );

	}

	/*-------------------------------------------------------------------------/

		Read-only

	/-------------------------------------------------------------------------*/

	get normalizeX() {

		return CursorTracker.normalize(
			( this.clientX - this.offsetX ),
			this.hitbox.width
		);

	}

	get normalizeY() {

		return CursorTracker.normalize(
			( this.clientY - this.offsetY ),
			this.hitbox.height
		);

	}

	get reverseX() {

		return CursorTracker.reverse( this.x );

	}

	get reverseY() {

		return CursorTracker.reverse( this.y );

	}

	get polarizeX() {

		return CursorTracker.polarize( this.x );

	}

	get polarizeY() {

		return CursorTracker.polarize( this.y );

	}

	get reversePolarizeX() {

		return CursorTracker.reversePolarize( this.x );

	}

	get reversePolarizeY() {

		return CursorTracker.reversePolarize( this.y );

	}

	get centerX() {

		return CursorTracker.center( this.x );

	}

	get centerY() {

		return CursorTracker.center( this.y );

	}

	get reverseCenterX() {

		return CursorTracker.reverseCenter( this.x );

	}

	get reverseCenterY() {

		return CursorTracker.reverseCenter( this.y );

	}

}

/*-----------------------------------------------------------------------------/

	Static

/-----------------------------------------------------------------------------*/

CursorTracker.clamp = n => n > 1 ? 1 : n < 0 ? 0 : n;
CursorTracker.normalize =
	( n, total ) => CursorTracker.clamp( n / total ); 		// 0 > 1
CursorTracker.reverse = n => 1 - n; 						// 1 > 0
CursorTracker.polarize = n => ( n * 2 ) - 1;				// -1 > 1
CursorTracker.reversePolarize = n => 1 - ( n * 2 );			// 1 > -1
CursorTracker.center = n => 1 - Math.abs( n - 0.5 ) * 2;	// 0 > 1 > 0
CursorTracker.reverseCenter = n => Math.abs( n - 0.5 ) * 2;	// 1 > 0 > 1

export { CursorTracker };
