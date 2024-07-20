import React, {Key, useState} from 'react';
import {useControlledState} from '@react-stately/utils';
import {FocusScope} from '@react-aria/focus';
import {TreeContext, TreeContextValue} from './tree-context';
import {TreeItemRenderer} from './tree-item';
import {renderTree} from './render-tree';

export interface TreeNode {
  id: number | string;
  children: TreeNode[];
}

interface TreeProps<T extends TreeNode> {
  children: TreeItemRenderer<T>;
  nodes: T[];
  selectedKeys?: Key[];
  expandedKeys?: Key[];
  defaultExpandedKeys?: Key[];
  onExpandedKeysChange?: (value: Key[]) => void;
  defaultSelectedKeys?: Key[];
  onSelectedKeysChange?: (value: Key[]) => void;
}
export function Tree<T extends TreeNode>({
  children,
  nodes,
  ...props
}: TreeProps<T>) {
  const [expandedKeys, setExpandedKeys] = useControlledState(
    props.expandedKeys,
    props.defaultSelectedKeys,
    props.onExpandedKeysChange
  );
  const [selectedKeys, setSelectedKeys] = useControlledState(
    props.selectedKeys,
    props.defaultSelectedKeys,
    props.onSelectedKeysChange
  );
  const [focusedNode, setFocusedNode] = useState<Key | undefined>();

  const value: TreeContextValue = {
    expandedKeys,
    setExpandedKeys,
    selectedKeys,
    setSelectedKeys,
    focusedNode,
    setFocusedNode,
  };

  return (
    <TreeContext.Provider value={value}>
      <FocusScope>
        <TreeRoot nodes={nodes} itemRenderer={children} />
      </FocusScope>
    </TreeContext.Provider>
  );
}

interface TreeRootProps<T extends TreeNode> {
  nodes: TreeNode[];
  itemRenderer: TreeItemRenderer<T>;
}
function TreeRoot<T extends TreeNode>(props: TreeRootProps<T>) {
  return (
    <ul className="overflow-hidden text-sm" role="tree">
      {renderTree(props)}
    </ul>
  );
}
