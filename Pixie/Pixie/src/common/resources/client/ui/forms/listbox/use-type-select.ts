import React, {useRef} from 'react';
import {useCollator} from '../../../i18n/use-collator';

interface UseTypeSelectReturn {
  findMatchingItem: (
    e: React.KeyboardEvent,
    listContent: (string | null)[],
    fromIndex?: number | null
  ) => number | null;
}

interface SearchState {
  search: string;
  timeout: ReturnType<typeof setTimeout> | undefined;
}

export function useTypeSelect(): UseTypeSelectReturn {
  const collator = useCollator({usage: 'search', sensitivity: 'base'});
  const state = useRef<SearchState>({
    search: '',
    timeout: undefined,
  }).current;

  const getMatchingIndex = (
    listContent: (string | null)[],
    fromIndex?: number | null
  ) => {
    let index = fromIndex ?? 0;
    while (index != null) {
      const item = listContent[index];
      const substring = item?.slice(0, state.search.length);

      if (substring && collator.compare(substring, state.search) === 0) {
        return index;
      }

      if (index < listContent.length - 1) {
        index++;
        // reached the end of list
      } else {
        return null;
      }
    }

    return null;
  };

  const findMatchingItem: UseTypeSelectReturn['findMatchingItem'] = (
    e,
    listContent,
    fromIndex = 0
  ) => {
    const character = getStringForKey(e.key);
    if (!character || e.ctrlKey || e.metaKey) {
      return null;
    }

    // Do not propagate the Spacebar event if it's meant to be part of the search.
    // When we time out, the search term becomes empty, hence the check on length.
    // Trimming is to account for the case of pressing the Spacebar more than once,
    // which should cycle through the selection/deselection of the focused item.
    if (character === ' ' && state.search.trim().length > 0) {
      e.preventDefault();
      e.stopPropagation();
    }

    state.search += character;

    // Use the delegate to find a key to focus.
    // Prioritize items after the currently focused item, falling back to searching the whole list.
    let index = getMatchingIndex(listContent, fromIndex);

    // If no key found, search from the top.
    if (index == null) {
      index = getMatchingIndex(listContent, 0);
    }

    clearTimeout(state.timeout);
    state.timeout = setTimeout(() => {
      state.search = '';
    }, 500);

    return index ?? null;
  };

  return {findMatchingItem};
}

function getStringForKey(key: string) {
  // If the key is of length 1, it is an ASCII value.
  // Otherwise, if there are no ASCII characters in the key name,
  // it is a Unicode character.
  // See https://www.w3.org/TR/uievents-key/
  if (key.length === 1 || !/^[A-Z]/i.test(key)) {
    return key;
  }

  return '';
}
