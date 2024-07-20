export const IS_CLIENT = typeof window !== 'undefined';
export const UA = IS_CLIENT ? window.navigator?.userAgent.toLowerCase() : '';
export const IS_IOS = /iphone|ipad|ipod|ios|CriOS|FxiOS/.test(UA);
export const IS_ANDROID = /android/.test(UA);
export const IS_MOBILE = IS_CLIENT && (IS_IOS || IS_ANDROID);
export const IS_IPHONE =
  IS_CLIENT && /(iPhone|iPod)/gi.test(window.navigator?.platform);
export const IS_FIREFOX = /firefox/.test(UA);
// @ts-ignore
export const IS_CHROME = IS_CLIENT && window.chrome;
export const IS_SAFARI =
  IS_CLIENT &&
  !IS_CHROME &&
  // @ts-ignore
  (window.safari || IS_IOS || /(apple|safari)/.test(UA));
