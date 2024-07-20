import {Canvas} from 'fabric/fabric-impl';
import type {Tools} from '../tools/init-tools';
import type {PixieState} from './store';
import {useStore} from './store';

export function state(): PixieState {
  return useStore.getState();
}

export function tools(): Tools {
  return state().editor.tools;
}

export function fabricCanvas(): Canvas {
  return state().fabric;
}
