import React, {
  ComponentPropsWithoutRef,
  JSXElementConstructor,
  KeyboardEventHandler,
  MouseEventHandler,
  useContext,
  useRef,
  useState,
} from 'react';
import {TableContext} from './table-context';
import {TableCell} from './table-cell';
import {TableDataItem} from './types/table-data-item';
import {createEventHandler} from '../../utils/dom/create-event-handler';
import {usePointerEvents} from '../interactions/use-pointer-events';
import {isCtrlOrShiftPressed} from '../../utils/keybinds/is-ctrl-or-shift-pressed';
import {useTableRowStyle} from '@common/ui/tables/style/use-table-row-style';
import clsx from 'clsx';

const interactableElements = ['button', 'a', 'input', 'select', 'textarea'];

export interface RowElementProps<T = TableDataItem>
  extends ComponentPropsWithoutRef<'tr'> {
  item: T & {isPlaceholder?: boolean};
}

interface TableRowProps {
  item: TableDataItem;
  index: number;
  renderAs?: JSXElementConstructor<RowElementProps>;
  className?: string;
  style?: React.CSSProperties;
}
export function TableRow({
  item,
  index,
  renderAs,
  className,
  style,
}: TableRowProps) {
  const {
    selectedRows,
    columns,
    toggleRow,
    selectRow,
    onAction,
    selectRowOnContextMenu,
    enableSelection,
    selectionStyle,
    hideHeaderRow,
  } = useContext(TableContext);

  const isTouchDevice = useRef(false);
  const isSelected = selectedRows.includes(item.id);
  const [isHovered, setIsHovered] = useState(false);

  const clickedOnInteractable = (e: React.MouseEvent | PointerEvent) => {
    return (e.target as HTMLElement).closest(interactableElements.join(','));
  };

  const doubleClickHandler: MouseEventHandler<HTMLDivElement> = e => {
    if (
      selectionStyle === 'highlight' &&
      onAction &&
      !isTouchDevice.current &&
      !clickedOnInteractable(e)
    ) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };

  const anyRowsSelected = !!selectedRows.length;

  const handleRowTap = (e: PointerEvent) => {
    if (clickedOnInteractable(e)) return;
    if (selectionStyle === 'checkbox') {
      if (enableSelection && (anyRowsSelected || !onAction)) {
        toggleRow(item);
      } else if (onAction) {
        onAction(item, index);
      }
    } else if (selectionStyle === 'highlight') {
      if (isTouchDevice.current) {
        if (enableSelection && anyRowsSelected) {
          toggleRow(item);
        } else {
          onAction?.(item, index);
        }
      } else if (enableSelection) {
        selectRow(item, isCtrlOrShiftPressed(e));
      }
    }
  };

  const {domProps} = usePointerEvents({
    onPointerDown: e => {
      isTouchDevice.current = e.pointerType === 'touch';
    },
    onPress: handleRowTap,
    onLongPress: enableSelection
      ? () => {
          if (isTouchDevice.current) {
            toggleRow(item);
          }
        }
      : undefined,
  });

  const keyboardHandler: KeyboardEventHandler = e => {
    if (enableSelection && e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (selectionStyle === 'checkbox') {
        toggleRow(item);
      } else {
        selectRow(item);
      }
    } else if (e.key === 'Enter' && !selectedRows.length && onAction) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };

  const contextMenuHandler: MouseEventHandler = e => {
    if (selectRowOnContextMenu && enableSelection) {
      if (!selectedRows.includes(item.id)) {
        selectRow(item);
      }
    }
    // prevent context menu on mobile
    if (isTouchDevice.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const styleClassName = useTableRowStyle({index, isSelected});

  const RowElement = renderAs || 'div';
  return (
    <RowElement
      role="row"
      aria-rowindex={index + 1 + (hideHeaderRow ? 0 : 1)}
      aria-selected={isSelected}
      tabIndex={-1}
      className={clsx(className, styleClassName)}
      item={RowElement === 'div' ? (undefined as any) : item}
      onDoubleClick={createEventHandler(doubleClickHandler)}
      onKeyDown={createEventHandler(keyboardHandler)}
      onContextMenu={createEventHandler(contextMenuHandler)}
      onPointerEnter={createEventHandler(() => setIsHovered(true))}
      onPointerLeave={createEventHandler(() => setIsHovered(false))}
      style={style}
      {...domProps}
    >
      {columns.map((column, cellIndex) => (
        <TableCell
          rowIndex={index}
          rowIsHovered={isHovered}
          index={cellIndex}
          item={item}
          key={`${item.id}-${column.key}`}
        />
      ))}
    </RowElement>
  );
}
