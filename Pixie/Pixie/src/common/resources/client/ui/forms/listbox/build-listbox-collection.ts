import {Children, isValidElement, ReactElement, ReactNode} from 'react';
import memoize from 'nano-memoize';
import {ListboxItemProps} from './item';
import {ListboxSectionProps, Section} from './section';
import {ListBoxChildren} from './types';

export type ListboxCollection = Map<string | number, CollectionItem<any>>;

export type CollectionItem<T> = {
  index: number;
  textLabel: string;
  element: ReactElement<ListboxItemProps>;
  value: string | number;
  item?: T;
  isDisabled?: boolean;
  section?: ReactElement<ListboxSectionProps>;
};

type Props<T> = ListBoxChildren<T> & {
  inputValue?: string;
  maxItems?: number;
};

export const buildListboxCollection = memoize(
  ({maxItems, children, items, inputValue}: Props<any>) => {
    let collection = childrenToCollection({children, items});
    let filteredCollection = filterCollection({collection, inputValue});

    if (maxItems) {
      collection = new Map([...collection.entries()].slice(0, maxItems));
      filteredCollection = new Map(
        [...filteredCollection.entries()].slice(0, maxItems)
      );
    }

    return {collection, filteredCollection};
  }
);

type filterCollectionProps = {
  collection: ListboxCollection;
  inputValue?: string;
};
const filterCollection = memoize(
  ({collection, inputValue}: filterCollectionProps) => {
    let filteredCollection: ListboxCollection = new Map();

    const query = inputValue ? `${inputValue}`.toLowerCase().trim() : '';
    if (!query) {
      filteredCollection = collection;
    } else {
      let filterIndex = 0;
      collection.forEach((meta, value) => {
        const haystack = meta.item ? JSON.stringify(meta.item) : meta.textLabel;
        if (haystack.toLowerCase().trim().includes(query)) {
          filteredCollection.set(value, {...meta, index: filterIndex++});
        }
      });
    }

    return filteredCollection;
  }
);

const childrenToCollection = memoize(
  ({children, items}: ListBoxChildren<any>) => {
    let reactChildren: ReactNode;
    if (items && typeof children === 'function') {
      reactChildren = items.map(item => {
        return children(item);
      });
    } else {
      reactChildren = children as ReactNode;
    }

    const collection = new Map<string | number, CollectionItem<any>>();
    let optionIndex = 0;

    const setOption = (
      element: ReactElement<ListboxItemProps>,
      section?: any,
      sectionIndex?: number,
      sectionItemIndex?: number
    ) => {
      const index = optionIndex++;
      const item = section
        ? // get item from nested array
          items?.[sectionIndex!].items[sectionItemIndex!]
        : // get item from flat array
          items?.[index];

      collection.set(element.props.value, {
        index,
        element,
        textLabel: getTextLabel(element),
        item,
        section,
        isDisabled: element.props.isDisabled,
        value: element.props.value,
      });
    };

    Children.forEach(reactChildren, (child, childIndex) => {
      if (!isValidElement(child)) return;
      if (child.type === Section) {
        Children.forEach(
          child.props.children,
          (nestedChild, nestedChildIndex) => {
            setOption(nestedChild, child, childIndex, nestedChildIndex);
          }
        );
      } else {
        setOption(child as ReactElement<ListboxItemProps>);
      }
    });

    return collection;
  }
);

function getTextLabel(item: ReactElement<ListboxItemProps>): string {
  const content = item.props.children;

  if (item.props.textLabel) {
    return item.props.textLabel;
  }
  if (content && (content as any).props?.defaultMessage) {
    return (content as any).props.defaultMessage[0].value;
  }

  return `${content}` || '';
}
