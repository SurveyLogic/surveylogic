import {ReactElement} from 'react';

export interface MessageDescriptor {
  message: string;
  values?: Record<
    string,
    | string
    | number
    | null
    | undefined
    | ReactElement
    | ((parts: string) => ReactElement)
  >;
}
