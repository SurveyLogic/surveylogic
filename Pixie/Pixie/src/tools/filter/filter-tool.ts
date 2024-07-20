import {fabric} from 'fabric';
import {IAllFilters, IBaseFilter, Image} from 'fabric/fabric-impl';
import {FilterConfig, filterList, FilterOptions} from './filter-list';
import {ucFirst} from '@common/utils/string/uc-first';
import {useStore} from '../../state/store';
import {ObjectName} from '../../objects/object-name';
import {state, tools} from '../../state/utils';

export interface FabricFilter extends IBaseFilter {
  type: string;
  matrix?: number[];

  [key: string]: any;
}

export class FilterTool {
  constructor() {
    useStore.subscribe(
      s => s.history.pointer,
      () => {
        this.syncState();
      }
    );
  }

  /**
   * Apply specified filter to all images.
   */
  apply(filterName: string) {
    state().filter.select(filterName, this.hasOptions(filterName));
    const filter = this.getByName(filterName);
    if (this.isApplied(filter.name)) {
      this.remove(filter.name);
      return;
    }

    const newFilter = this.create(filter);
    this.getImages().forEach(image => {
      image.filters?.push(newFilter);
      image.applyFilters();
    });

    this.syncState();
    tools().canvas.render();
  }

  /**
   * Remove specified filter from all images.
   */
  remove(filterName: string) {
    state().filter.deselect(filterName);
    const filter = this.getByName(filterName);
    this.getImages().forEach(image => {
      const i = this.findFilterIndex(
        filter.name,
        image.filters as FabricFilter[]
      );
      image.filters?.splice(i, 1);
      image.applyFilters();
    });
    this.syncState();
    tools().canvas.render();
  }

  /**
   * Get a list of all available filters.
   */
  getAll(): FilterConfig[] {
    return filterList;
  }

  /**
   * Get configuration for specified filter.
   */
  getByName(name: string): FilterConfig {
    return filterList.find(f => f.name === name) as FilterConfig;
  }

  /**
   * Check if specified filter is currently applied.
   */
  isApplied(name: string): boolean {
    const mainImage = tools().canvas.getMainImage();
    if (!mainImage) return false;
    return this.findFilterIndex(name, mainImage.filters as FabricFilter[]) > -1;
  }

  /**
   * Change specified value for an active filter.
   */
  applyValue(
    filterName: string,
    optionName: string,
    optionValue: number | string
  ) {
    const filter = this.getByName(filterName);

    this.getImages().forEach(image => {
      const fabricFilter = ((image.filters || []) as FabricFilter[]).find(
        curr => curr.type.toLowerCase() === filter.name.toLowerCase()
      );
      if (!fabricFilter) return;

      fabricFilter[optionName] = optionValue;

      // filter has a special "apply" function that needs to be invoked
      if (filter.apply) {
        filter.apply(fabricFilter, optionName, optionValue);
      }

      image.applyFilters();
    });

    tools().canvas.render();
  }

  /**
   * Create a custom filter.
   */
  addCustom(
    name: string,
    filter: object,
    editableOptions?: FilterOptions,
    initialConfig?: object
  ) {
    const imgFilters = fabric.Image.filters as unknown as Record<string, any>;
    imgFilters[ucFirst(name)] = fabric.util.createClass(
      imgFilters.BaseFilter,
      filter
    );
    imgFilters[ucFirst(name)].fromObject = imgFilters.BaseFilter.fromObject;
    filterList.push({
      name,
      options: editableOptions,
      initialConfig,
    });
  }

  /**
   * @hidden
   */
  create(config: FilterConfig): IBaseFilter {
    const initialConfig = config.initialConfig || {};
    let filter: IBaseFilter;
    if (config.uses) {
      initialConfig.matrix = config.matrix;
      filter = new fabric.Image.filters[ucFirst(config.uses)](initialConfig);
    } else {
      Object.entries(config.options || {}).forEach(([key, value]) => {
        initialConfig[key] = value.current;
      });
      filter = new fabric.Image.filters[
        ucFirst(config.name) as keyof IAllFilters
      ](initialConfig);
    }
    (filter as FabricFilter).name = config.name;
    return filter;
  }

  /**
   * @hidden
   */
  hasOptions(name: string) {
    return !!this.getByName(name).options;
  }

  /**
   * @hidden
   */
  findFilterIndex(name: string, fabricFilters?: FabricFilter[]): number {
    if (!fabricFilters?.length) return -1;

    const filterConfig = this.getByName(name);

    return fabricFilters.findIndex(fabricFilter => {
      return this.configMatchesFabricFilter(filterConfig, fabricFilter);
    });
  }

  /**
   * @hidden
   */
  syncState() {
    const applied: string[] = [];
    const fabricFilters = this.getImages()[0]?.filters || [];
    fabricFilters.forEach(fabricFilter => {
      const filterConfig = this.getByFabricFilter(fabricFilter as FabricFilter);
      if (filterConfig) {
        applied.push(filterConfig.name);
      }
    });
    useStore.setState({
      filter: {
        ...state().filter,
        applied,
      },
    });
  }

  private getByFabricFilter(
    fabricFilter: FabricFilter
  ): FilterConfig | undefined {
    return filterList.find(filterConfig => {
      return this.configMatchesFabricFilter(filterConfig, fabricFilter);
    });
  }

  private configMatchesFabricFilter(
    filterConfig: FilterConfig,
    fabricFilter: FabricFilter
  ): boolean {
    const type = fabricFilter.type.toLowerCase().replace(' ', '');
    if (type === filterConfig.fabricType || type === filterConfig.name) {
      return true;
    }
    // match by matrix
    return (
      type === 'convolute' &&
      this.matrixAreEqual(filterConfig.matrix, fabricFilter.matrix)
    );
  }

  private matrixAreEqual(
    matrix1: number[] | undefined,
    matrix2: number[] | undefined
  ): boolean {
    if (!matrix1 || !matrix2 || matrix1.length !== matrix2.length) return false;
    for (let i = matrix1.length; i--; ) {
      if (matrix1[i] !== matrix2[i]) return false;
    }
    return true;
  }

  private getImages(): Image[] {
    return tools()
      .objects.getAll()
      .filter(obj => {
        return (
          obj.name === ObjectName.Image || obj.name === ObjectName.MainImage
        );
      }) as Image[];
  }
}
