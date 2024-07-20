import {useCallback} from 'react';
import memoize from 'nano-memoize';
import {useSelectedLocale} from './selected-locale';
import {handlePluralMessage} from './handle-plural-message';
import {MessageDescriptor} from './message-descriptor';
import {shallowEqual} from '../utils/shallow-equal';

export interface UseTransReturn {
  trans: (props: MessageDescriptor) => string;
}

export function useTrans(): UseTransReturn {
  const {lines, localeCode} = useSelectedLocale();
  const trans = useCallback(
    (props: MessageDescriptor): string => {
      return translate({...props, lines, localeCode});
    },
    [lines, localeCode]
  );

  return {trans};
}

interface TranslateProps extends MessageDescriptor {
  lines?: Record<string, string>;
  localeCode: string;
}
const translate = memoize(
  (props: TranslateProps) => {
    let {lines, message, values, localeCode} = props;
    message = lines?.[message] || message;

    if (!values) {
      return message;
    }

    message = handlePluralMessage(localeCode, props);

    Object.entries(values).forEach(([key, value]) => {
      message = message.replace(`:${key}`, `${value}`);
    });

    return message;
  },
  {equals: shallowEqual, callTimeout: 0}
);
