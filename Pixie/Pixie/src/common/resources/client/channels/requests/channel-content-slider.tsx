import {ChannelContentProps} from '@common/channels/requests/channel-content';
import React from 'react';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import {useCarousel} from '@app/admin/channels/use-carousel';
import {Title} from '@app/titles/models/title';
import {TitleRating} from '@app/reviews/title-rating';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import clsx from 'clsx';
import {TitleLink} from '@app/titles/title-link';

export function ChannelContentSlider({channel}: ChannelContentProps) {
  const {trans} = useTrans();
  const {scrollContainerRef, scrollToIndex, activePage} = useCarousel();
  const titles = channel.content?.data as Title[];

  // todo: add channel heading, incase it's not shown at the top of the page

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto snap-always snap-x snap-mandatory scroll-smooth select-none hidden-scrollbar"
      >
        {titles.map(item => (
          <div
            key={item.id}
            className="relative w-full flex-shrink-0 snap-start snap-normal"
          >
            <img
              src={item.backdrop}
              className="rounded aspect-video w-full"
              alt=""
            />
            <div className="absolute inset-0 w-full h-full text-white flex items-center justify-center bg-black/60 rounded">
              <div className="max-w-620 text-lg">
                <TitleRating item={item} />
                <div className="text-5xl my-8">
                  <TitleLink title={item} />
                </div>
                <div>{item.description}</div>
                <Button
                  variant="flat"
                  color="primary"
                  startIcon={<MediaPlayIcon />}
                  radius="rounded-full"
                  className="mt-24 min-h-42 min-w-144"
                >
                  <Trans message="Play trailer" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-14 absolute bottom-12 left-0 right-0 mx-auto">
        {titles.map((item, index) => (
          <button
            onClick={() => scrollToIndex(index)}
            key={item.id}
            className="w-full max-w-36 flex-auto py-14 group"
            aria-label={trans(
              message('Show :name', {values: {name: item.name}})
            )}
          >
            <span
              className={clsx(
                'block w-full h-4 group-hover:bg-primary rounded shadow transition-colors',
                activePage === index ? 'bg-primary' : 'bg-white'
              )}
              role="presentation"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
