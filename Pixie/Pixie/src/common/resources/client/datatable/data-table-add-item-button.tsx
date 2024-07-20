import {AddIcon} from '../icons/material/Add';
import {Button} from '../ui/buttons/button';
import React, {ReactNode} from 'react';
import {useIsMobileMediaQuery} from '../utils/hooks/is-mobile-media-query';
import {IconButton} from '../ui/buttons/icon-button';
import {To} from 'react-router-dom';
import {ButtonBaseProps} from '../ui/buttons/button-base';

export interface DataTableAddItemButtonProps {
  children: ReactNode;
  to?: To;
  elementType?: ButtonBaseProps['elementType'];
  onClick?: ButtonBaseProps['onClick'];
}
export const DataTableAddItemButton = React.forwardRef<
  HTMLButtonElement,
  DataTableAddItemButtonProps
>(({children, to, elementType, onClick}, ref) => {
  const isMobile = useIsMobileMediaQuery();

  if (isMobile) {
    return (
      <IconButton
        ref={ref}
        variant="flat"
        color="primary"
        radius="rounded"
        className="flex-shrink-0"
        size="sm"
        to={to}
        elementType={elementType}
        onClick={onClick}
      >
        <AddIcon />
      </IconButton>
    );
  }

  return (
    <Button
      ref={ref}
      startIcon={<AddIcon />}
      variant="flat"
      color="primary"
      size="sm"
      to={to}
      elementType={elementType}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});
