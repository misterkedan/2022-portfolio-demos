import { Sketchpad } from './keda/three/Sketchpad';
import { RainSketch } from './sketches/rain/RainSketch';

const sketch = new RainSketch();

const sketchpad = new Sketchpad( {
	container: 'background',
} );
sketchpad.init( sketch );


