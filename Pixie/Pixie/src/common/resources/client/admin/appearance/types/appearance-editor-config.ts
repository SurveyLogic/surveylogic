import {To} from 'react-router-dom';
import {AppearanceEditorSection} from './appearance-editor-section';

export interface IAppearanceConfig {
  preview: {
    navigationRoutes: string[];
    defaultRoute?: To;
  };
  sections: Record<string, AppearanceEditorSection>;
}

export interface MenuSectionConfig {
  positions: string[];
  availableRoutes: string[];
}
