import { IBaseFilter } from 'fabric/fabric-impl';
import { FilterConfig, FilterOptions } from './filter-list';
export interface FabricFilter extends IBaseFilter {
    type: string;
    matrix?: number[];
    [key: string]: any;
}
export declare class FilterTool {
    constructor();
    /**
     * Apply specified filter to all images.
     */
    apply(filterName: string): void;
    /**
     * Remove specified filter from all images.
     */
    remove(filterName: string): void;
    /**
     * Get a list of all available filters.
     */
    getAll(): FilterConfig[];
    /**
     * Get configuration for specified filter.
     */
    getByName(name: string): FilterConfig;
    /**
     * Check if specified filter is currently applied.
     */
    isApplied(name: string): boolean;
    /**
     * Change specified value for an active filter.
     */
    applyValue(filterName: string, optionName: string, optionValue: number | string): void;
    /**
     * Create a custom filter.
     */
    addCustom(name: string, filter: object, editableOptions?: FilterOptions, initialConfig?: object): void;
    /**
     * @hidden
     */
    create(config: FilterConfig): IBaseFilter;
    /**
     * @hidden
     */
    hasOptions(name: string): boolean;
    /**
     * @hidden
     */
    findFilterIndex(name: string, fabricFilters?: FabricFilter[]): number;
    /**
     * @hidden
     */
    syncState(): void;
    private getByFabricFilter;
    private configMatchesFabricFilter;
    private matrixAreEqual;
    private getImages;
}
