import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {CodeIcon} from '../../icons/material/Code';
import {MenubarButtonProps} from './menubar-button-props';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../ui/navigation/menu/menu-trigger';

export function CodeBlockMenuTrigger({editor, size}: MenubarButtonProps) {
  const language = editor.getAttributes('codeBlock').language || '';
  return (
    <MenuTrigger
      selectionMode="single"
      selectedValue={language}
      onSelectionChange={key => {
        editor.commands.toggleCodeBlock({language: key as string});
      }}
    >
      <IconButton
        className={clsx('flex-shrink-0')}
        size={size}
        color={language ? 'primary' : null}
        radius="rounded"
      >
        <CodeIcon />
      </IconButton>
      <Menu>
        <MenuItem value="html">HTML</MenuItem>
        <MenuItem value="javascript">JavaScript</MenuItem>
        <MenuItem value="css">CSS</MenuItem>
        <MenuItem value="php">PHP</MenuItem>
        <MenuItem value="shell">Shell</MenuItem>
        <MenuItem value="bash">Bash</MenuItem>
        <MenuItem value="ruby">Ruby</MenuItem>
        <MenuItem value="python">Python</MenuItem>
        <MenuItem value="java">Java</MenuItem>
        <MenuItem value="c++">C++</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
