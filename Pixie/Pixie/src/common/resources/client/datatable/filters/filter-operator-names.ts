import {FilterOperator} from './backend-filter';
import {message} from '../../i18n/message';
import {MessageDescriptor} from '../../i18n/message-descriptor';

export const FilterOperatorNames: {[op in FilterOperator]: MessageDescriptor} =
  {
    '=': message('is'),
    '!=': message('is not'),
    '>': message('is greater than'),
    '>=': message('is greater than or equal to'),
    '<': message('is less than'),
    '<=': message('is less than or equal to'),
    has: message('Include'),
    doesntHave: message('Do not include'),
    between: message('Is between'),
  };
