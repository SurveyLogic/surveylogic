import { MutableRefObject } from 'react';
import { CropzoneRefs } from './cropzone-refs';
type Props = {
    name: 'lineVer1' | 'lineVer2' | 'lineHor1' | 'lineHor2';
    refs: MutableRefObject<CropzoneRefs>;
};
export declare function Line({ name, refs }: Props): import("react/jsx-runtime").JSX.Element;
export {};
