/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default, it checks if it is at least 1px.
 */
export const loadImage = (
  src: string,
  minWidth = 1
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const handler = () => {
      // @ts-expect-error
      delete image.onload;
      // @ts-expect-error
      delete image.onerror;
      if (image.naturalWidth >= minWidth) {
        resolve(image);
      } else {
        reject(image);
      }
    };
    Object.assign(image, {onload: handler, onerror: handler, src});
  });
