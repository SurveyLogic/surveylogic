import React, {Fragment, useCallback, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {StickerCategory} from '../../../../config/default-stickers';
import {stickerUrl} from '../../shape-tool';
import {Button} from '@common/ui/buttons/button';
import {state, tools} from '../../../../state/utils';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useActiveTheme} from '../../../../utils/use-active-theme';

type Props = {
  category: StickerCategory;
};

export function StickerList({category}: Props) {
  const activeTheme = useActiveTheme();
  const name = category.name;
  const iterable = category.list
    ? category.list
    : Array.from(Array(category.items).keys());

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: iterable.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 52, []),
    overscan: 5,
  });

  useEffect(() => {
    virtualizer.scrollToIndex(0);
    // don't add virtualizer to deps, otherwise there will be infinite rerender
    // eslint-disable-next-line
  }, [name]);

  return (
    <Fragment>
      <div
        ref={parentRef}
        className="tiny-scrollbar overflow-x-auto overflow-y-hidden"
        style={{height: `52px`}}
      >
        <div
          className="h-full relative mx-auto"
          style={{width: `${virtualizer.getTotalSize()}px`}}
        >
          {virtualizer.getVirtualItems().map(virtualColumn => {
            const stickerName = `${iterable[virtualColumn.index]}`;
            return (
              <div
                key={virtualColumn.index}
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${virtualColumn.size}px`,
                  transform: `translateX(${virtualColumn.start}px)`,
                }}
              >
                <Button
                  variant="outline"
                  radius="rounded-xl"
                  size="md"
                  equalWidth
                  onClick={async () => {
                    await tools().shape.addSticker(category.name, stickerName);
                    state().setDirty(true);
                  }}
                >
                  <img
                    className={clsx(
                      'm-auto m-auto w-28 h-28',
                      category.invertPreview && activeTheme?.isDark && 'invert'
                    )}
                    src={stickerUrl(category, stickerName)}
                    alt={stickerName}
                  />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
