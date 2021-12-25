import { Sketchpad } from 'keda/three/Sketchpad';
import { RainSketch } from './sketches/rain/RainSketch';
import { HoloscanSketch } from './sketches/holoscan/HoloscanSketch';

const sketches = {
	rain: () => new RainSketch(),
	holoscan: () => new HoloscanSketch(),
};

//const sketch = sketches.rain();
const sketch = sketches.holoscan();

const sketchpad = new Sketchpad( {
	container: 'background',
	//fps: 240,
	//fps: 5,
	//fps: 0,
} );
sketchpad.init( sketch );
