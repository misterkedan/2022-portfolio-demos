import { RainSketch } from './sketches/rain/RainSketch';
import { Sketch } from './sketchpad/Sketch';
import { Sketchpad } from './sketchpad/Sketchpad';
import { LinearGradient } from './sketchpad/three/LinearGradient';

const sketchpad = new Sketchpad( { container: 'background' } );

const sketch = new RainSketch();
//sketch.stage.add( new LinearGradient() );

sketchpad.init( sketch );


