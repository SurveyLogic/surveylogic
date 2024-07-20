import clsx from 'clsx';
import {
  aspectRatioFromStr,
  calcNewSizeFromAspectRatio,
} from '@common/ui/interactions/utils/calc-new-size-from-aspect-ratio';
import {useStore} from '../../../../state/store';
import {tools} from '../../../../state/utils';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../../ui/navbar/scrollable-view';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {Trans} from '@common/i18n/trans';

export function CropPresetBtns() {
  const presets = useStore(s => s.config.tools?.crop?.presets) || [];
  const selectedRatio = useStore(s => s.crop.selectedAspectRatio);
  const allowCustomRatio =
    useStore(s => s.config.tools?.crop?.allowCustomRatio) ?? true;

  const btns = presets
    .filter(preset => {
      return preset.ratio || (!preset.ratio && allowCustomRatio);
    })
    .map(preset => (
      <ScrollableViewItem key={preset.ratio || preset.name}>
        <ButtonBase
          onClick={() => tools().crop.resetCropzone(preset.ratio)}
          className="flex flex-col items-center justify-between cursor-pointer h-56"
        >
          <PresetPreview preset={preset} selectedRatio={selectedRatio} />
          <PresetName preset={preset} selectedRatio={selectedRatio} />
        </ButtonBase>
      </ScrollableViewItem>
    ));

  return <ScrollableView gap="gap-18">{btns}</ScrollableView>;
}

type PresetProps = {
  preset: {ratio: string | null; name?: string};
  selectedRatio: string | null;
};

function PresetPreview({preset, selectedRatio}: PresetProps) {
  let width = 40;
  let height = 30;
  if (preset.ratio) {
    const ratio = aspectRatioFromStr(preset.ratio);
    ({width, height} = calcNewSizeFromAspectRatio(ratio, width, height));
  }
  const className = clsx('border-2', {
    'border-dotted': preset.ratio === null,
    'border-primary': selectedRatio === preset.ratio,
  });
  return (
    <div
      style={{width: `${width}px`, height: `${height}px`}}
      className={className}
    />
  );
}

function PresetName({preset, selectedRatio}: PresetProps) {
  const className = clsx('mt-4 text-center text-xs', {
    'text-primary': selectedRatio === preset.ratio,
  });
  return (
    <div className={className}>
      {preset.name ? <Trans message={preset.name} /> : preset.ratio}
    </div>
  );
}
