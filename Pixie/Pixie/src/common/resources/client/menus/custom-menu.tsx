import React, {forwardRef, Fragment, ReactElement} from 'react';
import {NavLink} from 'react-router-dom';
import clsx from 'clsx';
import {MenuConfig, MenuItemConfig} from '../core/settings/settings';
import {createSvgIconFromTree} from '../icons/create-svg-icon';
import {Orientation} from '../ui/forms/orientation';
import {useCustomMenu} from './use-custom-menu';
import {Trans} from '../i18n/trans';
import {IconSize} from '@common/icons/svg-icon';

type MatchDescendants = undefined | boolean | ((to: string) => boolean);

interface CustomMenuProps {
  className?: string;
  matchDescendants?: MatchDescendants;
  iconClassName?: string;
  iconSize?: IconSize;
  itemClassName?:
    | string
    | ((props: {
        isActive: boolean;
        item: MenuItemConfig;
      }) => string | undefined);
  gap?: string;
  menu?: string | MenuConfig;
  children?: (menuItem: MenuItemConfig) => ReactElement;
  orientation?: Orientation;
  onlyShowIcons?: boolean;
  unstyled?: boolean;
}
export function CustomMenu({
  className,
  iconClassName,
  itemClassName,
  gap = 'gap-30',
  menu: menuOrPosition,
  orientation = 'horizontal',
  children,
  matchDescendants,
  onlyShowIcons,
  iconSize,
  unstyled = false,
}: CustomMenuProps) {
  const menu = useCustomMenu(menuOrPosition);
  if (!menu) return null;

  return (
    <div
      className={clsx(
        'flex',
        gap,
        orientation === 'vertical' ? 'flex-col items-start' : 'items-center',
        className
      )}
      data-menu-id={menu.id}
    >
      {menu.items.map(item => {
        if (children) {
          return children(item);
        }
        return (
          <CustomMenuItem
            unstyled={unstyled}
            onlyShowIcon={onlyShowIcons}
            matchDescendants={matchDescendants}
            iconClassName={iconClassName}
            iconSize={iconSize}
            className={props => {
              return typeof itemClassName === 'function'
                ? itemClassName({...props, item})
                : itemClassName;
            }}
            key={item.id}
            item={item}
          />
        );
      })}
    </div>
  );
}

interface MenuItemProps extends React.RefAttributes<HTMLAnchorElement> {
  item: MenuItemConfig;
  iconClassName?: string;
  className?: (props: {isActive: boolean}) => string | undefined;
  matchDescendants?: MatchDescendants;
  onlyShowIcon?: boolean;
  iconSize?: IconSize;
  unstyled?: boolean;
}
export const CustomMenuItem = forwardRef<HTMLAnchorElement, MenuItemProps>(
  (
    {
      item,
      className,
      matchDescendants,
      unstyled,
      onlyShowIcon,
      iconClassName,
      iconSize = 'sm',
      ...linkProps
    },
    ref
  ) => {
    const label = <Trans message={item.label} />;
    const Icon = item.icon && createSvgIconFromTree(item.icon);
    const content = (
      <Fragment>
        {Icon && <Icon size={iconSize} className={iconClassName} />}
        {(!Icon || !onlyShowIcon) && label}
      </Fragment>
    );

    const baseClassName =
      !unstyled &&
      'block whitespace-nowrap flex items-center justify-start gap-10';

    const focusClassNames = !unstyled && 'outline-none focus-visible:ring-2';

    if (item.type === 'link') {
      return (
        <a
          className={clsx(
            baseClassName,
            className?.({isActive: false}),
            focusClassNames
          )}
          href={item.action}
          target={item.target}
          data-menu-item-id={item.id}
          ref={ref}
          {...linkProps}
        >
          {content}
        </a>
      );
    }
    return (
      <NavLink
        end={
          typeof matchDescendants === 'function'
            ? matchDescendants(item.action)
            : matchDescendants
        }
        className={props =>
          clsx(baseClassName, className?.(props), focusClassNames)
        }
        to={item.action}
        target={item.target}
        data-menu-item-id={item.id}
        ref={ref}
        {...linkProps}
      >
        {content}
      </NavLink>
    );
  }
);
