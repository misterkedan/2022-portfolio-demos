import { Sketchpad } from 'keda/three/Sketchpad';
import { RainSketch } from './sketches/rain/RainSketch';
import { NavscanSketch } from './sketches/navscan/NavscanSketch';
import { BlockflowSketch } from './sketches/blockflow/BlockflowSketch';

const sketchpad = new Sketchpad( {
	container: 'background',
	//debug: true,
	//fps: 240,
	//fps: 2,
	//fps: 0,
} );

const options = { sketchpad };
const sketches = {
	rain: () => new RainSketch( options ),
	navscan: () => new NavscanSketch( options ),
	blockflow: () => new BlockflowSketch( options ),
};

//const sketch = sketches.rain();
//const sketch = sketches.navscan();
const sketch = sketches.blockflow();

sketchpad.init( sketch );
