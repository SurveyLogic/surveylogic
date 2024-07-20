import {isAbsoluteUrl} from '../urls/is-absolute-url';

class LazyLoader {
  private loadedAssets: Record<string, 'loaded' | Promise<void>> = {};

  loadAsset(
    url: string,
    params: {
      id?: string;
      force?: boolean;
      type?: 'js' | 'css';
      parentEl?: HTMLElement;
    } = {type: 'js'}
  ): Promise<any> {
    // script is already loaded, return resolved promise
    if (this.loadedAssets[url] === 'loaded' && !params.force) {
      return new Promise<void>(resolve => resolve());
    }

    // script has never been loaded before, load it, return promise and resolve on script load event
    if (
      !this.loadedAssets[url] ||
      (params.force && this.loadedAssets[url] === 'loaded')
    ) {
      this.loadedAssets[url] = new Promise(resolve => {
        const finalUrl = isAbsoluteUrl(url) ? url : `assets/${url}`;
        const finalId = buildId(url, params.id);

        if (params.type === 'css') {
          this.loadStyleAsset(finalUrl, finalId, resolve);
        } else {
          this.loadScriptAsset(finalUrl, finalId, resolve, params.parentEl);
        }
      });
      return this.loadedAssets[url] as Promise<void>;
    }

    // script is still loading, return existing promise
    return this.loadedAssets[url] as Promise<void>;
  }

  /**
   * Check whether asset is loading or has already loaded.
   */
  alreadyLoading(url: string): boolean {
    return this.loadedAssets[url] != null;
  }

  private loadStyleAsset(
    url: string,
    id: string,
    resolve: (value?: any | PromiseLike<any>) => void
  ) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.id = buildId(url, id);
    style.href = url;

    style.onload = () => {
      this.loadedAssets[url] = 'loaded';
      resolve();
    };

    document.head.appendChild(style);
  }

  private loadScriptAsset(
    url: string,
    id: string,
    resolve: (value?: any | PromiseLike<any>) => void,
    parentEl?: HTMLElement
  ) {
    const s: HTMLScriptElement = document.createElement('script');
    s.async = true;
    s.id = buildId(url, id);
    s.src = url;

    s.onload = () => {
      this.loadedAssets[url] = 'loaded';
      resolve();
    };

    (parentEl || document.body).appendChild(s);
  }
}

function buildId(url: string, id?: string): string {
  return id || (url.split('/').pop() as string);
}

export default new LazyLoader();
