import clsx from 'clsx';
import {useStore} from '@app/state/store';
import {ActiveToolOverlay} from '@app/state/editor-state';
import {filterNameMessages} from '@app/tools/filter/filter-list';
import {state, tools} from '@app/state/utils';
import {assetUrl} from '@app/utils/asset-url';
import {Trans} from '@common/i18n/trans';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CancelIcon} from '@common/icons/material/Cancel';
import {TuneIcon} from '@common/icons/material/Tune';
import {Fragment} from 'react';

type FilterButtonProps = {
  filter: string;
};

export function FilterButton({filter}: FilterButtonProps) {
  const isActive = useStore(s => s.filter.applied.includes(filter));
  const hasOptions = tools().filter.hasOptions(filter);

  const className = clsx('block flex-shrink-0 rounded', {
    'text-primary border-primary': isActive,
  });

  const msg = filterNameMessages[filter];
  const content = (
    <Fragment>
      <div className="relative">
        <FilterImg filter={filter} />
        {isActive && <ActiveOverlay filter={filter} hasOptions={hasOptions} />}
      </div>
      <div className="mt-4 text-center text-xs capitalize">
        {msg ? <Trans {...msg} /> : filter}
      </div>
    </Fragment>
  );

  if (isActive && hasOptions) {
    return <div className={className}>{content}</div>;
  }
  return (
    <ButtonBase
      className={className}
      onClick={() => {
        if (isActive) {
          tools().filter.remove(filter);
        } else {
          tools().filter.apply(filter);
        }
      }}
    >
      {content}
    </ButtonBase>
  );
}

type FilterImgProps = {
  filter: string;
};

function FilterImg({filter}: FilterImgProps) {
  const isSelected = useStore(s => s.filter.selected === filter);
  const className = clsx('m-auto w-96 h-56 border rounded object-cover', {
    shadow: isSelected,
  });
  return (
    <img
      src={assetUrl(`images/filter/${filter}.jpg`)}
      className={className}
      alt=""
    />
  );
}

type ActiveOverlayProps = {
  hasOptions: boolean;
  filter: string;
};

function ActiveOverlay({filter, hasOptions}: ActiveOverlayProps) {
  const removeBtn = (
    <IconButton
      color="primary"
      size="md"
      onClick={() => {
        tools().filter.remove(filter);
      }}
    >
      <CancelIcon />
    </IconButton>
  );
  return (
    <div className="flex items-center justify-center bg-background/70 absolute inset-0 border-2 border-primary rounded">
      {hasOptions ? removeBtn : <CancelIcon className="svg-icon icon-md" />}
      {hasOptions && (
        <ToggleSettingsButton filter={filter} hasOptions={hasOptions} />
      )}
    </div>
  );
}

type ToggleSettingsButtonProps = {
  hasOptions: boolean;
  filter: string;
};

function ToggleSettingsButton({filter, hasOptions}: ToggleSettingsButtonProps) {
  return (
    <IconButton
      color="primary"
      size="md"
      onClick={() => {
        if (
          state().activeToolOverlay === ActiveToolOverlay.Filter &&
          state().filter.selected === filter
        ) {
          state().setActiveTool(state().activeTool, null);
        } else {
          state().filter.select(filter, hasOptions);
        }
      }}
    >
      <TuneIcon />
    </IconButton>
  );
}
