import { IAllFilters } from 'fabric/fabric-impl';
import { MessageDescriptor } from '@common/i18n/message-descriptor';
export interface FilterConfig {
    name: string;
    fabricType?: string;
    uses?: keyof IAllFilters;
    options?: FilterOptions;
    initialConfig?: {
        [key: string]: any;
    };
    matrix?: number[];
    apply?: Function;
}
export interface FilterOptions {
    [key: string]: SliderOptions | SelectOptions | ColorOptions;
}
interface SliderOptions {
    type: 'slider';
    current: number;
    min: number;
    max: number;
    step?: number;
}
interface SelectOptions {
    type: 'select';
    current: string;
    available: {
        key: string;
    }[];
}
interface ColorOptions {
    type: 'colorPicker';
    current: string;
}
export declare const filterList: FilterConfig[];
export declare const filterNameMessages: Record<string, MessageDescriptor>;
export declare const filterOptionMessages: Record<string, MessageDescriptor>;
export {};
