import {Key} from 'react';
import {MessageDescriptor} from '../../i18n/message-descriptor';

export class BackendFilter {
  defaultValue: BackendFilterOptions['defaultValue'];
  defaultOperator: BackendFilterOptions['defaultOperator'];
  key: BackendFilterOptions['key'];
  label: BackendFilterOptions['label'];
  description?: BackendFilterOptions['description'];
  type: BackendFilterOptions['type'];
  inputType?: BackendFilterOptions['inputType'];
  options: BackendFilterOptions['options'];
  operators: BackendFilterOptions['operators'];
  model?: BackendFilterOptions['model'];

  constructor(options: Partial<BackendFilterOptions>) {
    this.defaultValue =
      options.defaultValue !== undefined ? options.defaultValue : '';
    this.key = options.key!;
    this.label = options.label!;
    this.description = options.description;
    this.defaultOperator = options.defaultOperator || FilterOperator.eq;
    this.type = options.type || FilterControlType.Select;
    this.inputType = options.inputType;
    this.options = options.options || [];
    this.operators = options.operators || [];
    this.model = options.model;
  }
}

export interface BackendFilterOptions {
  defaultValue: any;
  key: string;
  label: MessageDescriptor;
  description?: MessageDescriptor;
  defaultOperator: FilterOperator;
  type: FilterControlType;
  // for input filter
  inputType: 'string' | 'number';
  // for select filter
  options: BackendFilterSelectOption[];
  operators: FilterOperator[];
  // for select normalized model filter
  model: string;
}

export interface BackendFilterSelectOption {
  label: MessageDescriptor;
  key: Key;
  value: any;
}

export enum FilterControlType {
  Select = 'select',
  DatePicker = 'datePicker',
  SelectModel = 'selectModel',
  Input = 'input',
  BooleanToggle = 'booleanToggle',
}

export enum FilterOperator {
  eq = '=',
  ne = '!=',
  gt = '>',
  gte = '>=',
  lt = '<',
  lte = '<=',
  has = 'has',
  doesntHave = 'doesntHave',
  between = 'between',
}

export const ALL_PRIMITIVE_OPERATORS = [
  FilterOperator.eq,
  FilterOperator.ne,
  FilterOperator.gt,
  FilterOperator.gte,
  FilterOperator.lt,
  FilterOperator.lte,
];
