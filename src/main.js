import { Sketch } from './sketchpad/Sketch';
import { Sketchpad } from './sketchpad/Sketchpad';
import { LinearGradient } from './sketchpad/three/LinearGradient';

const sketchpad = new Sketchpad();

const sketch = new Sketch();
sketch.stage.add( new LinearGradient() );

sketchpad.init( sketch );


