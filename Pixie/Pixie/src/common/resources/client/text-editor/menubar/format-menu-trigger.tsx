import React from 'react';
import clsx from 'clsx';
import {Button} from '../../ui/buttons/button';
import {KeyboardArrowDownIcon} from '../../icons/material/KeyboardArrowDown';
import {Keyboard} from '../../ui/keyboard/keyboard';
import {MenubarButtonProps} from './menubar-button-props';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../ui/navigation/menu/menu-trigger';
import {Trans} from '../../i18n/trans';

type Level = 1 | 2 | 3 | 4;

export function FormatMenuTrigger({editor, size}: MenubarButtonProps) {
  return (
    <MenuTrigger
      floatingMinWidth="w-256"
      onItemSelected={key => {
        editor.commands.focus();
        if (typeof key === 'string' && key.startsWith('h')) {
          editor.commands.toggleHeading({
            level: parseInt(key.replace('h', '')) as Level,
          });
        } else if (key === 'code') {
          editor.commands.toggleCode();
        } else if (key === 'strike') {
          editor.commands.toggleStrike();
        } else if (key === 'super') {
          editor.commands.toggleSuperscript();
        } else if (key === 'sub') {
          editor.commands.toggleSubscript();
        } else if (key === 'blockquote') {
          editor.commands.toggleBlockquote();
        } else if (key === 'paragraph') {
          editor.commands.setParagraph();
        }
      }}
    >
      <Button
        className={clsx('flex-shrink-0')}
        variant="text"
        size={size}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Trans message="Format" />
      </Button>
      <Menu>
        <MenuItem value="h1" endSection={<Keyboard modifier>Alt+1</Keyboard>}>
          <Trans message="Heading :number" values={{number: 1}} />
        </MenuItem>
        <MenuItem value="h2" endSection={<Keyboard modifier>Alt+2</Keyboard>}>
          <Trans message="Heading :number" values={{number: 2}} />
        </MenuItem>
        <MenuItem value="h3" endSection={<Keyboard modifier>Alt+3</Keyboard>}>
          <Trans message="Heading :number" values={{number: 3}} />
        </MenuItem>
        <MenuItem value="h4" endSection={<Keyboard modifier>Alt+4</Keyboard>}>
          <Trans message="Heading :number" values={{number: 4}} />
        </MenuItem>
        <MenuItem value="code" endSection={<Keyboard modifier>E</Keyboard>}>
          <Trans message="Code" />
        </MenuItem>
        <MenuItem
          value="strike"
          endSection={<Keyboard modifier>Shift+X</Keyboard>}
        >
          <Trans message="Strikethrough" />
        </MenuItem>
        <MenuItem
          value="super"
          endSection={
            <Keyboard modifier separator=" ">
              .
            </Keyboard>
          }
        >
          <Trans message="Superscript" />
        </MenuItem>
        <MenuItem
          value="sub"
          endSection={
            <Keyboard modifier separator=" ">
              ,
            </Keyboard>
          }
        >
          <Trans message="Subscript" />
        </MenuItem>
        <MenuItem
          value="blockquote"
          endSection={<Keyboard modifier>Shift+B</Keyboard>}
        >
          <Trans message="Blockquote" />
        </MenuItem>
        <MenuItem
          value="paragraph"
          endSection={<Keyboard modifier>Alt+0</Keyboard>}
        >
          <Trans message="Paragraph" />
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
