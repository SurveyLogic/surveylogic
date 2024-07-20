import {cloneElement, Fragment, isValidElement, memo} from 'react';
import {shallowEqual} from '../utils/shallow-equal';
import {useSelectedLocale} from './selected-locale';
import {handlePluralMessage} from './handle-plural-message';
import {MessageDescriptor} from './message-descriptor';

export const Trans = memo((props: MessageDescriptor) => {
  const {message: initialMessage, values} = props;
  const {lines, localeCode} = useSelectedLocale();
  let translatedMessage = lines?.[initialMessage] || initialMessage;

  if (!values) {
    return <Fragment>{translatedMessage}</Fragment>;
  }

  translatedMessage = handlePluralMessage(localeCode, {
    message: translatedMessage,
    values,
  });

  // placeholders that need to be replaced with react element, eg. <Icon/>
  const nodePlaceholders: string[] = [];
  // placeholders that need to be replaced with render fn, eg. <a>link text</a>
  const tagNames: string[] = [];

  Object.entries(values).forEach(([key, value]) => {
    // value is react render function
    if (typeof value === 'function') {
      tagNames.push(key);
      // value is react element
    } else if (isValidElement(value)) {
      nodePlaceholders.push(key);
      // value is primitive, can do simple string replace
    } else if (value != undefined) {
      translatedMessage = translatedMessage.replace(`:${key}`, `${value}`);
    }
  });

  // if we need to replace placeholder with react element or render fn, we will need to split the
  // string by these placeholders and replace static string values with matching react element value
  if (tagNames.length || nodePlaceholders.length) {
    // we'll build simple OR regex to split the string eg. (<[ab]>content</[ab]>)|({(?:icon|link)})
    const regexArray: string[] = [];
    if (tagNames.length) {
      const tagNameMatchers = tagNames.join('');
      regexArray.push(`(<[${tagNameMatchers}]>.+?<\\/[${tagNameMatchers}]>)`);
    }
    if (nodePlaceholders.length) {
      const nodePlaceholderMatchers = nodePlaceholders.join('|');
      regexArray.push(`(\:(?:${nodePlaceholderMatchers}))`);
    }

    const regex = new RegExp(regexArray.join('|'), 'gm');
    const parts = translatedMessage.split(regex);

    // get rid of any empty strings or undefined from split by regex
    const compiledMessage = parts.filter(Boolean).map((part, i) => {
      // it's a tag name placeholder, eg. <a>content</a>
      if (part.startsWith('<') && part.endsWith('>')) {
        // grab tag content
        const matches = part.match(/<([a-z]+)>(.+?)<\/([a-z]+)>/);
        if (matches) {
          const [, tagName, content] = matches;
          const renderFn = values?.[tagName];
          if (typeof renderFn === 'function') {
            // pass it to render fn from values
            const node = renderFn(content);
            // add a key to avoid react errors
            return cloneElement(node, {key: i});
          }
        }
      }

      // it's a regular placeholder with react element value, eg. {icon}
      if (part.startsWith(':')) {
        const key = part.replace(':', '');
        const node = values?.[key];
        if (isValidElement(node)) {
          return cloneElement(node, {key: i});
        }
      }

      // it's a regular string
      return part;
    });
    return <Fragment>{compiledMessage}</Fragment>;
  }

  return <Fragment>{translatedMessage}</Fragment>;
}, areEqual);

export function areEqual<T extends MessageDescriptor = MessageDescriptor>(
  prevProps: T,
  nextProps: T
): boolean {
  const {values, ...otherProps} = prevProps;
  const {values: nextValues, ...nextOtherProps} = nextProps;
  return (
    shallowEqual(nextValues, values) &&
    shallowEqual(otherProps as any, nextOtherProps)
  );
}
