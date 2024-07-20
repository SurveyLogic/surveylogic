import React, {ComponentType, Fragment} from 'react';
import * as Icons from '../../icons/material/all-icons';
import {ButtonBase} from '../buttons/button-base';
import {SvgIconProps} from '../../icons/svg-icon';
import {elementToTree, IconTree} from '../../icons/create-svg-icon';
import {iconGridStyle} from './icon-grid-style';
import {useFilter} from '../../i18n/use-filter';
import clsx from 'clsx';
import {Trans} from '../../i18n/trans';

const entries = Object.entries(Icons).map(([name, cmp]) => {
  const prettyName = name
    .replace('Icon', '')
    .replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
  return [prettyName, cmp] as [string, ComponentType<SvgIconProps>];
});

interface IconListProps {
  onIconSelected: (icon: IconTree[] | null) => void;
  searchQuery: string;
}
export default function IconList({onIconSelected, searchQuery}: IconListProps) {
  const {contains} = useFilter({
    sensitivity: 'base',
  });
  const matchedEntries = entries.filter(([name]) =>
    contains(name, searchQuery)
  );

  return (
    <Fragment>
      <ButtonBase
        className={clsx(iconGridStyle.button, 'diagonal-lines')}
        onClick={e => {
          onIconSelected(null);
        }}
      >
        <Trans message="None" />
      </ButtonBase>
      {matchedEntries.map(([name, Icon]) => (
        <ButtonBase
          key={name}
          className={iconGridStyle.button}
          onClick={e => {
            const svgTree = elementToTree(
              e.currentTarget.querySelector('svg') as SVGElement
            );
            // only emit svg children, and not svg tag itself
            onIconSelected(svgTree.child as IconTree[]);
          }}
        >
          <Icon className="icon-lg block text-muted" />
          <span className="block mt-16 text-xs whitespace-normal capitalize">
            {name}
          </span>
        </ButtonBase>
      ))}
    </Fragment>
  );
}
