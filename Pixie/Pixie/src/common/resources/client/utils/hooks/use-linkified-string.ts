import {useMemo} from 'react';
import linkifyStr from 'linkify-string';

export function useLinkifiedString(text: string | null | undefined) {
  return useMemo(() => {
    if (!text) {
      return text;
    }
    return linkifyStr(text, {
      nl2br: true,
      attributes: {rel: 'nofollow'},
    });
  }, [text]);
}
