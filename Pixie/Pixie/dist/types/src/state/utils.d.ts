import { Canvas } from 'fabric/fabric-impl';
import type { Tools } from '../tools/init-tools';
import type { PixieState } from './store';
export declare function state(): PixieState;
export declare function tools(): Tools;
export declare function fabricCanvas(): Canvas;
