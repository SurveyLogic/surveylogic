import {To} from 'react-router-dom';
import {AppearanceValues} from '../appearance-store';

export interface AppearanceCommand {
  source: 'be-appearance-editor';
  type: string;
}

export interface Navigate {
  type: 'navigate';
  to: To;
}

export interface SetAppearanceValues {
  type: 'setValues';
  values: AppearanceValues;
}

export interface SetThemeColor {
  type: 'setThemeColor';
  name: string;
  value: string;
}

export interface SetActiveTheme {
  type: 'setActiveTheme';
  themeId: number | string;
}

export interface SetCustomCode {
  type: 'setCustomCode';
  mode: 'css' | 'html';
  value?: string;
}

export type AllCommands =
  | Navigate
  | SetAppearanceValues
  | SetThemeColor
  | SetActiveTheme
  | SetCustomCode;
