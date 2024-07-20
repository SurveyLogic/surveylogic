import {Button} from '../../ui/buttons/button';
import {BackendFilter} from './backend-filter';
import {FilterAltIcon} from '../../icons/material/FilterAlt';
import {Trans} from '../../i18n/trans';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';
import {IconButton} from '../../ui/buttons/icon-button';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import {AddFilterDialog} from './add-filter-dialog';

interface AddFilterButtonProps {
  filters: BackendFilter[];
}
export function AddFilterButton({filters}: AddFilterButtonProps) {
  const isMobile = useIsMobileMediaQuery();

  const desktopButton = (
    <Button
      variant="outline"
      color="primary"
      startIcon={<FilterAltIcon />}
      size="sm"
      className="text-muted"
      data-testid="add-filter-button"
    >
      <Trans message="Filter" />
    </Button>
  );

  const mobileButton = (
    <IconButton
      color="primary"
      size="sm"
      variant="outline"
      radius="rounded"
      className="flex-shrink-0"
      data-testid="add-filter-button"
    >
      <FilterAltIcon />
    </IconButton>
  );

  return (
    <DialogTrigger type="popover">
      {isMobile ? mobileButton : desktopButton}
      <AddFilterDialog filters={filters} />
    </DialogTrigger>
  );
}
