import { Sketchpad } from 'keda/three/Sketchpad';
import { RainSketch } from './sketches/rain/RainSketch';
import { RetroSketch } from './sketches/retro/RetroSketch';

const sketches = {
	rain: () => new RainSketch(),
	retro: () => new RetroSketch(),
};

//const sketch = sketches.rain();
const sketch = sketches.retro();

const sketchpad = new Sketchpad( {
	container: 'background',
} );
sketchpad.init( sketch );


