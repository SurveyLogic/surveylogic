import React, {ReactNode} from 'react';
import {IllustratedMessage} from '../../ui/images/illustrated-message';
import {SvgImage} from '../../ui/images/svg-image/svg-image';
import {Trans} from '../../i18n/trans';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';

export interface DataTableEmptyStateMessageProps {
  isFiltering?: boolean;
  title: ReactNode;
  filteringTitle?: ReactNode;
  image: string;
  className?: string;
}
export function DataTableEmptyStateMessage({
  isFiltering,
  title,
  filteringTitle,
  image,
  className,
}: DataTableEmptyStateMessageProps) {
  const isMobile = useIsMobileMediaQuery();

  // allow user to disable filtering message variation by not passing in "filteringTitle"
  return (
    <IllustratedMessage
      className={className}
      size={isMobile ? 'sm' : 'md'}
      image={<SvgImage src={image} />}
      title={isFiltering && filteringTitle ? filteringTitle : title}
      description={
        isFiltering && filteringTitle ? (
          <Trans message="Try another search query or different filters" />
        ) : undefined
      }
    />
  );
}
