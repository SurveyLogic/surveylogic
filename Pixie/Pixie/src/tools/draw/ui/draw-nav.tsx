import React, {useEffect, useState} from 'react';
import {ColorPickerButton} from '@app/ui/color-picker-button';
import {useStore} from '@app/state/store';
import {tools} from '@app/state/utils';
import {assetUrl} from '@app/utils/asset-url';
import {
  ScrollableView,
  ScrollableViewItem,
} from '@app/ui/navbar/scrollable-view';
import {Trans} from '@common/i18n/trans';
import {Select} from '@common/ui/forms/select/select';
import {Item} from '@common/ui/forms/listbox/item';
import {useActiveTheme} from '@app/utils/use-active-theme';
import {EraserIcon} from '@app/tools/draw/ui/eraser-icon';

export function DrawNav() {
  useEffect(() => {
    tools().draw.enable();
    return () => {
      tools().draw.disable();
    };
  }, []);

  return (
    <ScrollableView gap="gap-16">
      <ScrollableViewItem>
        <ColorPickerButton
          size="sm"
          label={<Trans message="Brush Color" />}
          value={tools().draw.currentBrush.color}
          onChange={newColor => {
            tools().draw.setBrushColor(newColor);
          }}
        />
      </ScrollableViewItem>
      <ScrollableViewItem>
        <TypeSelect />
      </ScrollableViewItem>
      <ScrollableViewItem>
        <SizeSelect />
      </ScrollableViewItem>
    </ScrollableView>
  );
}

function SizeSelect() {
  const sizes = useStore(s => s.config.tools?.draw?.brushSizes) || [];
  const [selectedSize, setSelectedSize] = useState(
    tools().draw.currentBrush.width
  );
  return (
    <Select
      selectionMode="single"
      selectedValue={selectedSize}
      onSelectionChange={newValue => {
        setSelectedSize(newValue as number);
        tools().draw.setBrushSize(newValue as number);
      }}
      size="sm"
      label={<Trans message="Brush Size" />}
    >
      {sizes.map(size => (
        <Item key={size} value={size}>
          <div className="flex items-center">
            <div
              className="flex-shrink-0 mr-8 border-[3px] rounded-full"
              style={{width: `${size}px`, height: `${size}px`}}
            />
            {size}
          </div>
        </Item>
      ))}
    </Select>
  );
}

function TypeSelect() {
  const types = useStore(s => s.config.tools?.draw?.brushTypes) || [];
  const activeTheme = useActiveTheme();
  const [selectedType, setSelectedType] = useState(
    tools().draw.currentBrush.type
  );

  return (
    <Select
      selectionMode="single"
      selectedValue={selectedType}
      onSelectionChange={value => {
        setSelectedType(value as string);
        tools().draw.setBrushType(value as string);
      }}
      size="sm"
      label={<Trans message="Brush Type" />}
    >
      {types.map(type => (
        <Item key={type} value={type}>
          <div className="flex items-center">
            {type === 'EraserBrush' ? (
              <EraserIcon className="mr-8" />
            ) : (
              <img
                className="flex-shrink-0 mr-8 w-24 h-24"
                src={getBrushPreview(type, activeTheme?.isDark)}
                alt=""
              />
            )}
            <Trans message={type.replace(/([A-Z])/g, ' $1').trim()} />
          </div>
        </Item>
      ))}
    </Select>
  );
}

function getBrushPreview(type: string, isDarkMode = false): string {
  const name = type.replace('Brush', '').toLowerCase();
  const dir = isDarkMode ? 'white' : 'black';
  return assetUrl(`images/brushes/${dir}/${name}.png`);
}
