import {Helmet} from './helmet';
import {ReactElement} from 'react';
import {MessageDescriptor} from '../i18n/message-descriptor';
import {useSettings} from '../core/settings/use-settings';

type TitleChild = string | ReactElement<MessageDescriptor> | MessageDescriptor;
export type TitleMetaTagChildren = TitleChild | TitleChild[];

interface StaticPageTitleProps {
  children: TitleMetaTagChildren;
}
export function StaticPageTitle({children}: StaticPageTitleProps) {
  const {
    branding: {site_name},
  } = useSettings();
  return (
    <Helmet>
      {children ? (
        // @ts-ignore
        <title>
          {children} - {site_name}
        </title>
      ) : undefined}
    </Helmet>
  );
}
