import clsx from 'clsx';
import {LinkIcon} from '../../icons/material/Link';
import {ExternalLink} from '../../ui/buttons/external-link';
import {Trans} from '../../i18n/trans';
import {useSettings} from '../../core/settings/use-settings';

interface LearnMoreLinkProps {
  link: string;
  className?: string;
}
export function LearnMoreLink({link, className}: LearnMoreLinkProps) {
  const {site} = useSettings();
  if (site.hide_docs_button) {
    return null;
  }
  return (
    <div className={clsx('flex items-center gap-8', className)}>
      <LinkIcon size="sm" />
      <ExternalLink href={link}>
        <Trans message="Learn more" />
      </ExternalLink>
    </div>
  );
}
