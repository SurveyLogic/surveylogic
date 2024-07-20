import {useParams} from 'react-router-dom';
import {useCustomPage} from './use-custom-page';
import {Navbar} from '../ui/navigation/navbar/navbar';
import {Footer} from '../ui/footer/footer';
import {CustomPageBody} from '@common/custom-page/custom-page-body';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';

interface Props {
  slug?: string;
}
export function CustomPageLayout({slug}: Props) {
  const {pageSlug} = useParams();
  const query = useCustomPage(slug || pageSlug!);

  return (
    <div className="flex flex-col min-h-full bg">
      <PageMetaTags query={query} />
      <Navbar
        menuPosition="custom-page-navbar"
        className="flex-shrink-0 sticky top-0"
      />
      <div className="flex-auto">
        {query.data ? (
          <CustomPageBody page={query.data.page} />
        ) : (
          <PageStatus query={query} loaderClassName="mt-80" />
        )}
      </div>
      <Footer className="mx-14 md:mx-40" />
    </div>
  );
}
