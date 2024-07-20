import {Children, memo, ReactElement} from 'react';
import {shallowEqual} from '../utils/shallow-equal';
import {MetaTag} from './meta-tag';
import {TitleMetaTagChildren} from './static-page-title';
import {useTrans, UseTransReturn} from '../i18n/use-trans';

export const helmetAttribute = 'data-be-helmet';
let rafId: number | null;

interface HelmetProps {
  children?: ReactElement | ReactElement[];
  tags?: MetaTag[];
}
export const Helmet = memo(({children, tags}: HelmetProps) => {
  const {trans} = useTrans();
  if (!tags && children) {
    tags = mapChildrenToTags(children, trans);
  }

  updateTags(tags);

  return null;
}, shallowEqual);

function mapChildrenToTags(
  children: ReactElement | ReactElement[],
  trans: UseTransReturn['trans']
): MetaTag[] {
  return Children.map(children, child => {
    switch (child.type) {
      case 'title':
        return {
          nodeName: 'title',
          _text: titleTagChildrenToString(child.props.children, trans),
        };
      case 'meta':
        return {...child.props, nodeName: 'meta'};
    }
  });
}

function titleTagChildrenToString(
  children: TitleMetaTagChildren,
  trans: UseTransReturn['trans']
): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(c => titleTagChildrenToString(c, trans)).join('');
  }
  if ('message' in children) {
    return trans(children);
  }
  return trans(children.props);
}

function removeOldTags() {
  document.head.querySelectorAll(`[${helmetAttribute}]`).forEach(tag => {
    document.head.removeChild(tag);
  });
}

function updateTags(tags?: MetaTag[]) {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    removeOldTags();
    tags?.forEach(tag => {
      updateTag(tag);
    });
    rafId = null;
  });
}

function updateTag(tag: MetaTag) {
  // update title
  if (tag.nodeName === 'title') {
    if (typeof tag._text !== 'undefined' && document.title !== tag._text) {
      document.title = tag._text;
    }
    return;
  }

  // update <meta> tag
  const newElement = document.createElement(tag.nodeName);
  for (const key in tag) {
    const attribute = key as keyof MetaTag;
    if (attribute === 'nodeName') continue;
    if (attribute === '_text') {
      newElement.textContent =
        typeof tag._text === 'string' ? tag._text : JSON.stringify(tag._text);
    } else {
      const value = tag[attribute] == null ? '' : tag[attribute];
      newElement.setAttribute(attribute, value as string);
    }
  }

  newElement.setAttribute(helmetAttribute, 'true');
  document.head.appendChild(newElement);
}
