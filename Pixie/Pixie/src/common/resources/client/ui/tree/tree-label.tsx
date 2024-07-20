import React, {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useContext,
} from 'react';
import {TreeContext} from './tree-context';
import clsx from 'clsx';
import {ArrowRightIcon} from '../../icons/material/ArrowRight';

interface TreeLabelProps {
  level?: number;
  node: any;
  icon?: ReactNode;
  label?: ReactNode;
  className?: string;
}
export const TreeLabel = forwardRef<HTMLDivElement, TreeLabelProps>(
  ({icon, label, level = 0, node, className, ...domProps}, ref) => {
    const {expandedKeys, setExpandedKeys, selectedKeys, setSelectedKeys} =
      useContext(TreeContext);
    const isExpanded = expandedKeys.includes(node.id);
    const isSelected = selectedKeys.includes(node.id);

    const handleExpandIconClick: MouseEventHandler = e => {
      e.stopPropagation();
      const index = expandedKeys.indexOf(node.id);
      const newExpandedKeys = [...expandedKeys];
      if (index > -1) {
        newExpandedKeys.splice(index, 1);
      } else {
        newExpandedKeys.push(node.id);
      }
      setExpandedKeys(newExpandedKeys);
    };

    return (
      <div
        {...domProps}
        ref={ref}
        onClick={e => {
          e.stopPropagation();
          setSelectedKeys([node.id]);
        }}
        className={clsx(
          'flex flex-nowrap whitespace-nowrap items-center gap-4 py-6 rounded header cursor-pointer overflow-hidden text-ellipsis tree-label',
          className,
          isSelected && 'bg-primary/selected text-primary font-bold',
          !isSelected && 'hover:bg-hover'
        )}
      >
        {level > 0 && (
          <div className="flex">
            {Array.from({length: level}).map((_, i) => {
              return <div key={i} className="w-24 h-24" />;
            })}
          </div>
        )}
        <div onClick={handleExpandIconClick}>
          <ArrowRightIcon
            className={clsx(
              'icon-sm cursor-default transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
        </div>
        {icon}
        <div className="overflow-hidden text-ellipsis pr-6">{label}</div>
      </div>
    );
  }
);
TreeLabel.displayName = 'TreeLabel';
