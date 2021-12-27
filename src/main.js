import { Sketchpad } from 'keda/three/Sketchpad';
import { RainSketch } from './sketches/rain/RainSketch';
import { HoloscanSketch } from './sketches/holoscan/HoloscanSketch';
import { BlockflowSketch } from './sketches/blockflow/BlockflowSketch';

const sketchpad = new Sketchpad( {
	container: 'background',
	//debug: true,
	//fps: 240,
	//fps: 5,
	//fps: 0,
} );

const options = { sketchpad };
const sketches = {
	rain: () => new RainSketch( options ),
	holoscan: () => new HoloscanSketch( options ),
	blockflow: () => new BlockflowSketch( options ),
};

//const sketch = sketches.rain();
//const sketch = sketches.holoscan();
const sketch = sketches.blockflow();

sketchpad.init( sketch );
