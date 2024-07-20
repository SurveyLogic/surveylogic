import {CustomPage} from '@common/admin/custom-pages/custom-page';

interface CustomPageBodyProps {
  page: CustomPage;
}
export function CustomPageBody({page}: CustomPageBodyProps) {
  return (
    <div className="px-16 md:px-24">
      <div className="prose dark:prose-invert mx-auto my-50">
        <h1>{page.title}</h1>
        <div
          className="break-words whitespace-pre-wrap"
          dangerouslySetInnerHTML={{__html: page.body}}
        />
      </div>
    </div>
  );
}
