import React, {ReactNode, useRef, useState} from 'react';
import {useTrans} from '../../i18n/use-trans';
import {Trans} from '../../i18n/trans';
import {Avatar} from '../images/avatar';
import {Tooltip} from '../tooltip/tooltip';
import {IconButton} from '../buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {message} from '../../i18n/message';
import {Item} from './listbox/item';
import {ComboBox} from './combobox/combobox';
import {useController} from 'react-hook-form';
import {useControlledState} from '@react-stately/utils';
import {getInputFieldClassNames} from './input-field/get-input-field-class-names';
import clsx from 'clsx';
import {Skeleton} from '../skeleton/skeleton';
import {useNormalizedModels} from '../../users/queries/use-normalized-models';
import {useNormalizedModel} from '../../users/queries/use-normalized-model';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '../animation/opacity-animation';

interface NormalizedModelFieldProps {
  modelType: string;
  label?: ReactNode;
  className?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  invalid?: boolean;
  errorMessage?: string;
  description?: ReactNode;
  openMenuOnFocus?: boolean;
  autoFocus?: boolean;
  queryParams?: Record<string, string>;
  customEndpoint?: string;
  disabled?: boolean;
}
export function NormalizedModelField({
  modelType,
  label,
  className,
  value,
  defaultValue = '',
  onChange,
  description,
  errorMessage,
  invalid,
  openMenuOnFocus,
  autoFocus,
  queryParams,
  customEndpoint,
  disabled,
}: NormalizedModelFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useControlledState(
    value,
    defaultValue,
    onChange
  );
  const query = useNormalizedModels(
    modelType,
    {
      query: inputValue,
      ...queryParams,
    },
    null,
    customEndpoint
  );
  const {trans} = useTrans();

  const fieldClassNames = getInputFieldClassNames({size: 'md'});

  if (selectedValue) {
    return (
      <div className={className}>
        <div className={fieldClassNames.label}>{label}</div>
        <div
          className={clsx('p-10 border rounded', invalid && 'border-danger')}
        >
          <AnimatePresence initial={false} mode="wait">
            <SelectedModelPreview
              disabled={disabled}
              endpoint={customEndpoint}
              modelType={modelType}
              modelId={selectedValue}
              queryParams={queryParams}
              onEditClick={() => {
                setSelectedValue('');
                setInputValue('');
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                });
              }}
            />
          </AnimatePresence>
        </div>
        {description && !errorMessage && (
          <div className={fieldClassNames.description}>{description}</div>
        )}
        {errorMessage && (
          <div className={fieldClassNames.error}>{errorMessage}</div>
        )}
      </div>
    );
  }

  return (
    <ComboBox
      className={className}
      invalid={invalid}
      errorMessage={errorMessage}
      description={description}
      isAsync
      placeholder={trans(message('Find item..'))}
      label={label}
      isLoading={query.isFetching}
      items={query.data?.results}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      clearInputOnItemSelection
      selectionMode="single"
      selectedValue={selectedValue}
      onSelectionChange={setSelectedValue}
      ref={inputRef}
      openMenuOnFocus={openMenuOnFocus}
      autoFocus={autoFocus}
      disabled={disabled}
    >
      {model => (
        <Item
          value={model.id}
          key={model.id}
          description={model.description}
          startIcon={<Avatar src={model.image} />}
        >
          {model.name}
        </Item>
      )}
    </ComboBox>
  );
}

interface SelectedModelPreviewProps {
  modelType: string;
  modelId: string | number;
  selectedValue?: number | string;
  onEditClick?: () => void;
  endpoint?: string;
  disabled?: boolean;
  queryParams?: NormalizedModelFieldProps['queryParams'];
}
function SelectedModelPreview({
  modelType,
  modelId,
  onEditClick,
  endpoint,
  disabled,
  queryParams,
}: SelectedModelPreviewProps) {
  const {data, isLoading} = useNormalizedModel(
    modelType,
    modelId,
    queryParams,
    endpoint
  );

  if (isLoading || !data?.model) {
    return <LoadingSkeleton key="skeleton" />;
  }

  return (
    <m.div
      className={clsx(
        'flex items-center gap-10',
        disabled && 'text-disabled cursor-not-allowed pointer-events-none'
      )}
      key="preview"
      {...opacityAnimation}
    >
      {data.model.image && <Avatar src={data.model.image} />}
      <div>
        <div>{data.model.name}</div>
        <div className="text-muted text-xs">{data.model.description}</div>
      </div>
      <Tooltip label={<Trans message="Change item" />}>
        <IconButton
          className="ml-auto text-muted"
          size="sm"
          onClick={onEditClick}
          disabled={disabled}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </m.div>
  );
}

function LoadingSkeleton() {
  return (
    <m.div className="flex items-center gap-10" {...opacityAnimation}>
      <Skeleton variant="rect" size="w-32 h-32" />
      <div className="flex-auto max-h-[36px]">
        <Skeleton className="text-xs" />
        <Skeleton className="text-xs max-h-8" />
      </div>
      <Skeleton variant="icon" size="w-24 h-24" />
    </m.div>
  );
}

interface FormNormalizedModelFieldProps extends NormalizedModelFieldProps {
  name: string;
}
export function FormNormalizedModelField({
  name,
  ...fieldProps
}: FormNormalizedModelFieldProps) {
  const {
    field: {onChange, value = ''},
    fieldState: {invalid, error},
  } = useController({
    name,
  });

  return (
    <NormalizedModelField
      value={value}
      onChange={onChange}
      invalid={invalid}
      errorMessage={error?.message}
      {...fieldProps}
    />
  );
}
