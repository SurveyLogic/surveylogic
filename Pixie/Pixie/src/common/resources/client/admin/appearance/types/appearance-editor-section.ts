import {RouteObject, To} from 'react-router-dom';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {AppearanceValues} from '../appearance-store';

export interface AppearanceEditorBreadcrumbItem {
  label: MessageDescriptor | string;
  location: To;
}

export interface AppearanceEditorSection {
  label: MessageDescriptor;
  position?: number;
  previewRoute?: To;
  config?: unknown;
  routes?: RouteObject[];
  buildBreadcrumb: (
    pathname: string,
    formValue: AppearanceValues
  ) => AppearanceEditorBreadcrumbItem[];
}
