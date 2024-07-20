import React, {Suspense, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useCustomPage} from './requests/use-custom-page';
import {CustomPage} from '../custom-page';
import {FullPageLoader} from '@common/ui/progress/full-page-loader';

const TextEditor = React.lazy(() => import('./text-editor'));

interface PageEditorLayoutProps {
  allowSlugEditing?: boolean;
  endpoint?: string;
}
export function PageEditorLayout({
  allowSlugEditing = true,
  endpoint,
}: PageEditorLayoutProps) {
  const {data, isFetched, fetchStatus} = useCustomPage();
  const pageIsLoading = !isFetched && fetchStatus !== 'idle';
  const form = useForm<Partial<CustomPage>>();

  useEffect(() => {
    if (data?.page) {
      form.reset(data.page);
    }
  }, [form, data?.page]);

  return (
    <Suspense fallback={<FullPageLoader />}>
      <div className="min-h-full">
        {!pageIsLoading && (
          <TextEditor
            page={data?.page}
            allowSlugEditing={allowSlugEditing}
            endpoint={endpoint}
          />
        )}
      </div>
    </Suspense>
  );
}
