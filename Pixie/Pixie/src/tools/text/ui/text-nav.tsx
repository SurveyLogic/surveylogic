import {useEffect} from 'react';
import clsx from 'clsx';
import {
  ScrollableView,
  ScrollableViewItem,
} from '@app/ui/navbar/scrollable-view';
import {useStore} from '@app/state/store';
import {loadFonts} from '@common/ui/font-picker/load-fonts';
import {FontFaceConfig} from '@common/ui/font-picker/font-face-config';
import {state, tools} from '@app/state/utils';
import {assetUrl} from '@app/utils/asset-url';

export function TextNav() {
  const fonts = useStore(s => s.config.tools?.text?.items);

  // load fonts into dom
  useEffect(() => {
    if (fonts) {
      loadFonts(fonts, {prefixSrc: assetUrl, id: 'pixie-fonts'}).catch(
        () => {}
      );
    }
  }, [fonts]);

  // add text to canvas on text nav open
  useEffect(() => {
    const addedText = tools().text.selectOrAddText();
    if (addedText) {
      state().setDirty(true);
    }
  }, []);

  const fontButtons = (fonts || []).map(fontConfig => {
    return (
      <ScrollableViewItem key={fontConfig.family}>
        <FontButton fontConfig={fontConfig} />
      </ScrollableViewItem>
    );
  });

  return <ScrollableView className="pt-6">{fontButtons}</ScrollableView>;
}

type FontButtonProps = {
  fontConfig: FontFaceConfig;
};

function FontButton({fontConfig}: FontButtonProps) {
  const selectedFont = useStore(s => s.objects.active.editableProps.fontFamily);

  const className = clsx(
    'block px-6 w-110 h-68 text-sm bg border rounded-2xl',
    {
      'border-primary': selectedFont === fontConfig.family,
      'text-primary': selectedFont === fontConfig.family,
    }
  );

  return (
    <button
      type="button"
      className={className}
      style={{
        fontFamily: fontConfig.family,
        fontWeight: fontConfig.descriptors?.weight || 'normal',
      }}
      onClick={async () => {
        tools().text.selectOrAddText();
        state().setDirty(true);
        tools().objects.setValues({
          fontFamily: fontConfig.family,
        });
      }}
    >
      {fontConfig.family}
    </button>
  );
}
