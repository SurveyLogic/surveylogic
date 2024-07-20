import {TreeItemRenderer} from './tree-item';
import {cloneElement} from 'react';
import {TreeNode} from './tree';

interface RenderTreeProps<T extends TreeNode> {
  nodes: T[];
  parentNode?: T;
  itemRenderer: TreeItemRenderer<T>;
  level?: number;
}
export function renderTree<T extends TreeNode>({
  nodes,
  itemRenderer,
  parentNode,
  level,
}: RenderTreeProps<T>) {
  return nodes.map((node, index) => {
    return cloneElement(itemRenderer(node), {
      level: level == undefined ? 0 : level + 1,
      index,
      node,
      parentNode,
      key: node.id,
      itemRenderer,
    });
  });
}
