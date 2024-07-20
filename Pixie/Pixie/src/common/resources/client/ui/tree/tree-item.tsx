import React, {HTMLAttributes, ReactElement, ReactNode, Ref, useContext, useEffect} from 'react';
import {useFocusManager} from '@react-aria/focus';
import {TreeContext} from './tree-context';
import {createEventHandler} from '../../utils/dom/create-event-handler';
import clsx from 'clsx';
import {AnimatePresence, m} from 'framer-motion';
import {TreeNode} from './tree';
import {renderTree} from './render-tree';
import {TreeLabel} from './tree-label';

export type TreeItemRenderer<T extends TreeNode> = (
  node: any
) => ReactElement<TreeItemProps<T>>;

export interface TreeItemProps<T extends TreeNode>
  extends HTMLAttributes<HTMLElement> {
  label: ReactNode;
  icon: ReactNode;
  node?: T;
  parentNode?: T;
  level?: number;
  index?: number;
  itemRenderer?: TreeItemRenderer<T>;
  labelRef?: Ref<HTMLDivElement>;
  labelClassName?: string;
  className?: string;
}
export function TreeItem<T extends TreeNode>({
  label,
  icon,
  node,
  level,
  index,
  itemRenderer,
  labelRef,
  labelClassName,
  className,
  parentNode,
  ...domProps
}: TreeItemProps<T>) {
  const focusManager = useFocusManager();
  const {
    expandedKeys,
    selectedKeys,
    focusedNode,
    setFocusedNode,
    setExpandedKeys,
    setSelectedKeys,
  } = useContext(TreeContext);

  // clear focused node on unmount
  useEffect(() => {
    return () => {
      if (focusedNode === node?.id) {
        setFocusedNode(undefined);
      }
    };
  }, [focusedNode, node?.id, setFocusedNode]);

  if (!node || !itemRenderer) return null;

  const hasChildren = node.children.length;
  const isExpanded = hasChildren && expandedKeys.includes(node.id);
  const isSelected = selectedKeys.includes(node.id);
  const isFirstNode = level === 0 && index === 0;
  const isFocused =
    focusedNode == undefined ? isFirstNode : focusedNode === node.id;

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (focusedNode == null) return;
    switch (e.key) {
      // select the node
      case 'Enter':
      case ' ':
        e.stopPropagation();
        e.preventDefault();
        setSelectedKeys([focusedNode]);
        break;

      // expand node, or move focus to first (and only first) child
      case 'ArrowRight':
        e.stopPropagation();
        e.preventDefault();

        if (!hasChildren) return;

        if (!isExpanded) {
          setExpandedKeys([...expandedKeys, focusedNode]);
        } else {
          focusManager.focusNext();
        }
        break;

      // collapse node, or move focus to parent node
      case 'ArrowLeft':
        e.stopPropagation();
        e.preventDefault();

        if (isExpanded) {
          const index = expandedKeys.indexOf(focusedNode);
          const newKeys = [...expandedKeys];
          newKeys.splice(index, 1);
          setExpandedKeys(newKeys);
        } else if (parentNode) {
          const parentEl =
            document.activeElement?.parentElement?.closest('[tabindex]');
          if (parentEl) {
            (parentEl as HTMLElement).focus();
          }
        }
        break;

      // focus next visible node, recursively
      case 'ArrowDown':
        e.stopPropagation();
        e.preventDefault();
        focusManager.focusNext();
        break;

      // focus previous visible node, recursively
      case 'ArrowUp':
        e.stopPropagation();
        e.preventDefault();
        focusManager.focusPrevious();
        break;

      // focus first visible node
      case 'Home':
        e.stopPropagation();
        e.preventDefault();
        focusManager.focusFirst();
        break;

      // focus last visible node
      case 'End':
        e.stopPropagation();
        e.preventDefault();
        focusManager.focusLast();
        break;

      // expand all sibling nodes
      case '*':
        e.stopPropagation();
        e.preventDefault();

        if (parentNode?.children) {
          const newKeys = [...expandedKeys];
          parentNode.children.forEach(childNode => {
            if (
              childNode.children.length &&
              !expandedKeys.includes(childNode.id)
            ) {
              newKeys.push(childNode.id);
            }
          });
          if (newKeys.length !== expandedKeys.length) {
            setExpandedKeys(newKeys);
          }
        }
        break;
    }
  };

  return (
    <li
      role="treeitem"
      aria-expanded={isExpanded ? 'true' : 'false'}
      aria-selected={isSelected}
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={createEventHandler(onKeyDown)}
      onFocus={e => {
        e.stopPropagation();
        setFocusedNode(node.id);
      }}
      onBlur={e => {
        e.stopPropagation();
        // only clear focus state when focus moves outside the tree
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocusedNode(undefined);
        }
      }}
      className={clsx(
        'outline-none',
        // focus direct .tree-label child when this element has :focus-visible
        '[&>.tree-label]:focus-visible:ring [&>.tree-label]:focus-visible:ring-2 [&>.tree-label]:focus-visible:ring-inset',
        className
      )}
    >
      <TreeLabel
        ref={labelRef}
        className={labelClassName}
        node={node}
        level={level}
        label={label}
        icon={icon}
        {...domProps}
      />
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <m.ul
            key={`${node.id}-group`}
            role="group"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {opacity: 1, height: 'auto'},
              closed: {opacity: 0, height: 0, overflow: 'hidden'},
            }}
          >
            {renderTree({
              nodes: node.children,
              parentNode: node,
              itemRenderer,
              level,
            })}
          </m.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
