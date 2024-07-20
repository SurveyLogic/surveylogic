import React, {Fragment, useEffect, useState} from 'react';
import clsx from 'clsx';
import {RefCallBack} from 'react-hook-form';
import {Button} from './buttons/button';
import {LinkIcon} from '../icons/material/Link';
import {TextField} from './forms/input-field/text-field/text-field';
import {Trans} from '../i18n/trans';
import {useSettings} from '../core/settings/use-settings';
import {slugifyString} from '@common/utils/string/slugify-string';

export interface SlugEditorProps {
  prefix?: string;
  suffix?: string;
  host?: string;
  value?: string | null;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputRef?: RefCallBack;
  onInputBlur?: () => void;
  showLinkIcon?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  hideButton?: boolean;
}
export function SlugEditor({
  host,
  value: initialValue = '',
  placeholder,
  onChange,
  className,
  inputRef,
  onInputBlur,
  showLinkIcon = true,
  pattern,
  minLength,
  maxLength,
  hideButton,
  ...props
}: SlugEditorProps) {
  const {base_url} = useSettings();
  const prefix = props.prefix ? `/${props.prefix}` : '';
  const suffix = props.suffix ? `/${props.suffix}` : '';
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  host = host || base_url;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      if (value) {
        onChange?.(value);
      }
    }
  };

  let preview: string = '';
  if (value) {
    preview = value;
  } else if (placeholder) {
    preview = slugifyString(placeholder);
  }

  return (
    // can't use <form/> here as component might be used inside another form
    <div className={clsx('flex items-center', className)}>
      {showLinkIcon && <LinkIcon className="icon-md text-muted" />}
      <div className="text-primary ml-6 mr-14">
        {host}
        {prefix}
        {!isEditing && preview && (
          <Fragment>
            <span>/</span>
            <span className="font-medium">{preview}</span>
          </Fragment>
        )}
        {!isEditing ? suffix : null}
      </div>
      {isEditing && (
        <TextField
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          ref={inputRef}
          aria-label="slug"
          autoFocus
          className="mr-14"
          size="2xs"
          value={value as string}
          onBlur={onInputBlur}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
      )}
      {!hideButton && (
        <Button
          type="button"
          color="chip"
          variant="outline"
          size="2xs"
          onClick={() => {
            handleSubmit();
          }}
        >
          {isEditing ? <Trans message="Save" /> : <Trans message="Edit" />}
        </Button>
      )}
    </div>
  );
}
