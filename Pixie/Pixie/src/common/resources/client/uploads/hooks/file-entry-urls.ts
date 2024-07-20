import React, {useContext, useMemo} from 'react';
import {FileEntry} from '../file-entry';
import {useSettings} from '../../core/settings/use-settings';
import {isAbsoluteUrl} from '@common/utils/urls/is-absolute-url';

export const FileEntryUrlsContext = React.createContext<
  Record<string, string | number | null | undefined>
>(null!);

export function useFileEntryUrls(
  entry?: FileEntry,
  options?: {thumbnail?: boolean; downloadHashes?: string[]}
): {previewUrl?: string; downloadUrl?: string} {
  const {base_url} = useSettings();
  const urlSearchParams = useContext(FileEntryUrlsContext);

  return useMemo(() => {
    if (!entry) {
      return {};
    }

    let previewUrl: string | undefined;
    if (entry.url) {
      previewUrl = isAbsoluteUrl(entry.url)
        ? entry.url
        : `${base_url}/${entry.url}`;
    }

    const urls = {
      previewUrl,
      downloadUrl: `${base_url}/api/v1/file-entries/download/${
        options?.downloadHashes || entry.hash
      }`,
    };

    if (urlSearchParams) {
      // preview url
      if (urls.previewUrl) {
        urls.previewUrl = addParams(
          urls.previewUrl,
          {...urlSearchParams, thumbnail: options?.thumbnail ? 'true' : ''},
          base_url
        );
      }

      // download url
      urls.downloadUrl = addParams(urls.downloadUrl, urlSearchParams, base_url);
    }

    return urls;
  }, [
    base_url,
    entry,
    options?.downloadHashes,
    options?.thumbnail,
    urlSearchParams,
  ]);
}

function addParams(urlString: string, params: object, baseUrl: string): string {
  const url = new URL(urlString, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value as string);
  });
  return url.toString();
}
