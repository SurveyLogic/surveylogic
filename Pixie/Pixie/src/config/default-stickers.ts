import {emoticonsList} from './emoticons';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

export interface StickerCategory {
  name: string;
  items?: number;
  list?: string[];
  type: 'svg' | 'png';
  thumbnailUrl?: string;
  invertPreview?: boolean;
}

export const defaultStickers: StickerCategory[] = [
  {
    name: 'emoticons',
    list: emoticonsList,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/emoticon.svg',
  },
  {
    name: 'doodles',
    items: 100,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/doodles.svg',
  },
  {
    name: 'landmarks',
    items: 100,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/landmark.svg',
    invertPreview: true,
  },
  {
    name: 'bubbles',
    items: 104,
    type: 'png',
    thumbnailUrl: 'images/stickers/categories/speech-bubble.svg',
  },
  {
    name: 'transportation',
    items: 22,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/transportation.svg',
    invertPreview: true,
  },
  {
    name: 'beach',
    items: 22,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/beach.svg',
    invertPreview: true,
  },
];

export const StickerCategoryMessages: Record<string, MessageDescriptor> = {
  emoticons: message('Emoticons'),
  doodles: message('Doodles'),
  landmarks: message('Landmarks'),
  bubbles: message('Bubbles'),
  transportation: message('Transportation'),
  beach: message('Beach'),
};
