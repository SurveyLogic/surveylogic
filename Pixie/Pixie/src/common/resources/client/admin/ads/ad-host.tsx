import {useAuth} from '../../auth/use-auth';
import {memo, useEffect, useId, useMemo, useRef} from 'react';
import lazyLoader from '../../utils/http/lazy-loader';
import clsx from 'clsx';
import {useSettings} from '../../core/settings/use-settings';
import dot from 'dot-object';
import {Settings} from '@common/core/settings/settings';

interface AdHostProps {
  slot: keyof Omit<NonNullable<Settings['ads']>, 'disable'>;
  className?: string;
}
export function AdHost({slot, className}: AdHostProps) {
  const settings = useSettings();
  const {isSubscribed} = useAuth();
  const adCode = useMemo(() => {
    return dot.pick(`ads.${slot}`, settings);
  }, [slot, settings]);

  if (settings.ads?.disable || isSubscribed || !adCode) return null;

  return <InvariantAd className={className} slot={slot} adCode={adCode} />;
}

interface InvariantAdProps {
  slot: string;
  adCode: string;
  className?: string;
}
const InvariantAd = memo(
  ({slot, adCode, className}: InvariantAdProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const id = useId();

    useEffect(() => {
      if (ref.current) {
        loadAdScripts(adCode, ref.current).then(() => {
          executeAdJavascript(adCode, id);
        });
      }
      return () => {
        // @ts-ignore
        delete window['google_ad_modifications'];
      };
    }, [adCode, id]);

    return (
      <div
        ref={ref}
        id={id}
        className={clsx(
          'ad-host flex items-center justify-center w-full max-w-full overflow-hidden min-h-90 max-h-[600px]',
          `${slot.replace(/\./g, '-')}-host`,
          className
        )}
        dangerouslySetInnerHTML={{__html: getAdHtml(adCode)}}
      ></div>
    );
  },
  () => {
    // never re-render
    return false;
  }
);

function getAdHtml(adCode: string) {
  // strip out all script tags from ad code and leave only html
  return adCode
    ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// Load any external scripts needed by ad.
function loadAdScripts(adCode: string, parentEl: HTMLDivElement): Promise<any> {
  const promises = [];

  // load ad code script
  const pattern = /<script.*?src=['"](.*?)['"]/g;
  let match;

  while ((match = pattern.exec(adCode))) {
    if (match[1]) {
      promises.push(lazyLoader.loadAsset(match[1], {type: 'js', parentEl}));
    }
  }

  return Promise.all(promises);
}

// Execute ad code javascript and replace document.write if needed.
function executeAdJavascript(adCode: string, id: string) {
  // find any ad code javascript that needs to be executed
  const pattern = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
  let content;

  while ((content = pattern.exec(adCode))) {
    if (content[1]) {
      const r = `var d = document.createElement('div'); d.innerHTML = $1; document.getElementById('${id}').appendChild(d.firstChild);`;
      const toEval = content[1].replace(/document.write\((.+?)\);/, r);
      eval(toEval);
    }
  }
}
