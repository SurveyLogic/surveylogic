import React, {
  cloneElement,
  ComponentPropsWithRef,
  Fragment,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useCallback,
  useId,
  useRef,
} from 'react';
import clsx from 'clsx';
import {Button} from '../buttons/button';
import {Trans} from '../../i18n/trans';
import {useActiveUpload} from '../../uploads/uploader/use-active-upload';
import {UploadInputType} from '../../uploads/types/upload-input-config';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import {ProgressBar} from '../progress/progress-bar';
import {Disk} from '../../uploads/types/backend-metadata';
import {toast} from '@common/ui/toast/toast';
import {Field} from '@common/ui/forms/input-field/field';
import {
  getInputFieldClassNames,
  InputFieldStyle,
} from '@common/ui/forms/input-field/get-input-field-class-names';
import {FileEntry} from '@common/uploads/file-entry';
import {useAutoFocus} from '@common/ui/focus/use-auto-focus';
import {UploadStrategyConfig} from '@common/uploads/uploader/strategy/upload-strategy';
import {SvgIconProps} from '@common/icons/svg-icon';
import {IconButton} from '@common/ui/buttons/icon-button';
import {AddAPhotoIcon} from '@common/icons/material/AddAPhoto';
import {AvatarPlaceholderIcon} from '@common/auth/ui/account-settings/avatar/avatar-placeholder-icon';
import {ButtonBaseProps} from '@common/ui/buttons/button-base';

const TwoMB = 2 * 1024 * 1024;

interface ImageSelectorProps {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  errorMessage?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (newValue: string) => void;
  highlightSelector?: string;
  defaultValue?: string;
  diskPrefix: string;
  showRemoveButton?: boolean;
  showEditButtonOnHover?: boolean;
  autoFocus?: boolean;
  variant?: 'input' | 'square' | 'avatar';
  placeholderIcon?: ReactElement<SvgIconProps>;
  previewSize?: string;
  previewRadius?: string;
  stretchPreview?: boolean;
}
export function ImageSelector({
  className,
  label,
  description,
  value,
  onChange,
  defaultValue,
  diskPrefix,
  showRemoveButton,
  showEditButtonOnHover = false,
  invalid,
  errorMessage,
  required,
  autoFocus,
  variant = 'input',
  previewSize = 'h-80',
  placeholderIcon,
  stretchPreview = false,
  previewRadius,
  disabled,
}: ImageSelectorProps) {
  const {
    uploadFile,
    entry,
    uploadStatus,
    deleteEntry,
    isDeletingEntry,
    percentage,
  } = useActiveUpload();

  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus({autoFocus}, inputRef);

  const fieldId = useId();
  const labelId = label ? `${fieldId}-label` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  const imageUrl = value || entry?.url;

  const uploadOptions: UploadStrategyConfig = {
    showToastOnRestrictionFail: true,
    restrictions: {
      allowedFileTypes: [UploadInputType.image],
      maxFileSize: TwoMB,
    },
    metadata: {
      diskPrefix,
      disk: Disk.public,
    },
    onSuccess: (entry: FileEntry) => {
      onChange?.(entry.url);
    },
    onError: message => {
      if (message) {
        toast.danger(message);
      }
    },
  };

  const inputFieldClassNames = getInputFieldClassNames({
    description,
    descriptionPosition: 'top',
    invalid,
  });

  let VariantElement: JSXElementConstructor<VariantProps>;
  if (variant === 'avatar') {
    VariantElement = AvatarVariant;
  } else if (variant === 'square') {
    VariantElement = SquareVariant;
  } else {
    VariantElement = InputVariant;
  }

  const removeButton = showRemoveButton ? (
    <Button
      variant="link"
      color="danger"
      size="xs"
      disabled={isDeletingEntry || !imageUrl || disabled}
      onClick={() => {
        deleteEntry({
          onSuccess: () => onChange?.(''),
        });
      }}
    >
      <Trans message="Remove image" />
    </Button>
  ) : null;

  const useDefaultButton =
    defaultValue && value !== defaultValue ? (
      <Button
        variant="outline"
        color="primary"
        size="xs"
        disabled={disabled}
        onClick={() => {
          onChange?.(defaultValue);
        }}
      >
        <Trans message="Use default" />
      </Button>
    ) : null;

  const handleUpload = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className={clsx('text-sm', className)}>
      {label && (
        <div id={labelId} className={inputFieldClassNames.label}>
          {label}
        </div>
      )}
      {description && (
        <div className={inputFieldClassNames.description}>{description}</div>
      )}
      <div aria-labelledby={labelId} aria-describedby={descriptionId}>
        <Field
          fieldClassNames={inputFieldClassNames}
          errorMessage={errorMessage}
          invalid={invalid}
        >
          <VariantElement
            inputFieldClassNames={inputFieldClassNames}
            placeholderIcon={placeholderIcon}
            previewSize={previewSize}
            isLoading={uploadStatus === 'inProgress'}
            imageUrl={imageUrl}
            removeButton={removeButton}
            useDefaultButton={useDefaultButton}
            showEditButtonOnHover={showEditButtonOnHover}
            stretchPreview={stretchPreview}
            previewRadius={previewRadius}
            handleUpload={handleUpload}
            disabled={disabled}
          >
            <input
              ref={inputRef}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              // if file is already uploaded (from form or via props) set
              // required to false, otherwise farm validation will always fail
              required={imageUrl ? false : required}
              accept={UploadInputType.image}
              type="file"
              disabled={uploadStatus === 'inProgress'}
              className="sr-only"
              onChange={e => {
                if (e.target.files?.length) {
                  uploadFile(e.target.files[0], uploadOptions);
                }
              }}
            />
          </VariantElement>
          {uploadStatus === 'inProgress' && (
            <ProgressBar
              className="absolute top-0 left-0 right-0"
              size="xs"
              value={percentage}
            />
          )}
        </Field>
      </div>
    </div>
  );
}

interface VariantProps {
  children: ReactElement<ComponentPropsWithRef<'input'>>;
  inputFieldClassNames: InputFieldStyle;
  previewSize?: ImageSelectorProps['previewSize'];
  placeholderIcon?: ImageSelectorProps['placeholderIcon'];
  isLoading?: boolean;
  imageUrl?: string;
  removeButton?: ReactElement<ButtonBaseProps> | null;
  useDefaultButton?: ReactElement<ButtonBaseProps> | null;
  showEditButtonOnHover?: boolean;
  stretchPreview?: boolean;
  previewRadius?: string;
  handleUpload: () => void;
  disabled?: boolean;
}
function InputVariant({
  children,
  inputFieldClassNames,
  imageUrl,
  previewSize,
  stretchPreview,
  isLoading,
  handleUpload,
  removeButton,
  useDefaultButton,
  disabled,
}: VariantProps) {
  if (imageUrl) {
    return (
      <Fragment>
        <div
          className={`${previewSize} border rounded bg-fg-base/8 p-6 relative overflow-hidden mb-10`}
        >
          <img
            className={clsx(
              'h-full mx-auto rounded',
              stretchPreview ? 'object-cover' : 'object-contain'
            )}
            onClick={() => handleUpload()}
            src={imageUrl}
            alt=""
          />
          {children}
        </div>
        <Button
          onClick={() => handleUpload()}
          disabled={isLoading || disabled}
          className="mr-10"
          variant="outline"
          color="primary"
          size="xs"
        >
          <Trans message="Replace" />
        </Button>
        {removeButton && cloneElement(removeButton, {variant: 'outline'})}
        {useDefaultButton &&
          cloneElement(useDefaultButton, {variant: 'outline'})}
      </Fragment>
    );
  }
  return cloneElement(children, {
    className: clsx(
      inputFieldClassNames.input,
      'py-8',
      'file:bg-primary file:text-on-primary file:border-none file:rounded file:text-sm file:font-semibold file:px-10 file:h-24 file:mr-10'
    ),
  });
}

function SquareVariant({
  children,
  placeholderIcon,
  previewSize,
  imageUrl,
  stretchPreview,
  handleUpload,
  removeButton,
  useDefaultButton,
  previewRadius = 'rounded',
  showEditButtonOnHover = false,
  disabled,
}: VariantProps) {
  return (
    <div>
      <div
        className={clsx(
          previewSize,
          previewRadius,
          !imageUrl && 'border',
          'bg-fg-base/8 z-20 flex flex-col items-center justify-center gap-14 bg-no-repeat bg-center group',
          stretchPreview ? 'bg-cover' : 'bg-contain p-6'
        )}
        style={imageUrl ? {backgroundImage: `url(${imageUrl})`} : undefined}
        onClick={() => handleUpload()}
      >
        {placeholderIcon &&
          !imageUrl &&
          cloneElement(placeholderIcon, {size: 'lg'})}
        <Button
          variant="raised"
          color="white"
          size="xs"
          className={clsx(
            showEditButtonOnHover && 'invisible group-hover:visible'
          )}
          disabled={disabled}
        >
          {imageUrl ? (
            <Trans message="Replace image" />
          ) : (
            <Trans message="Upload image" />
          )}
        </Button>
      </div>
      {children}
      {(removeButton || useDefaultButton) && (
        <div className="mt-14">
          {removeButton && cloneElement(removeButton, {variant: 'link'})}
          {useDefaultButton &&
            cloneElement(useDefaultButton, {variant: 'link'})}
        </div>
      )}
    </div>
  );
}

function AvatarVariant({
  children,
  placeholderIcon,
  previewSize,
  isLoading,
  imageUrl,
  removeButton,
  useDefaultButton,
  handleUpload,
  previewRadius = 'rounded-full',
  disabled,
}: VariantProps) {
  if (!placeholderIcon) {
    placeholderIcon = (
      <AvatarPlaceholderIcon
        viewBox="0 0 48 48"
        className={clsx(
          'w-full h-full text-primary/40 bg-primary-light/40',
          previewRadius
        )}
      />
    );
  }
  return (
    <div>
      <div
        className={clsx('relative', previewSize)}
        onClick={() => handleUpload()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            className={clsx('w-full h-full object-cover', previewRadius)}
            alt=""
          />
        ) : (
          placeholderIcon
        )}
        <div className="bg-paper shadow-xl absolute -bottom-6 -right-6 rounded-full">
          <IconButton
            disabled={isLoading || disabled}
            type="button"
            variant="outline"
            size="sm"
            color="primary"
          >
            <AddAPhotoIcon />
          </IconButton>
        </div>
      </div>
      {children}
      {(removeButton || useDefaultButton) && (
        <div className="mt-14">
          {removeButton && cloneElement(removeButton, {variant: 'link'})}
          {useDefaultButton &&
            cloneElement(useDefaultButton, {variant: 'link'})}
        </div>
      )}
    </div>
  );
}

interface FormImageSelectorProps extends ImageSelectorProps {
  name: string;
}
export function FormImageSelector(props: FormImageSelectorProps) {
  const {
    field: {onChange, value = null},
    fieldState: {error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<ImageSelectorProps> = {
    onChange,
    value,
    invalid: error != null,
    errorMessage: error ? <Trans message="Please select an image." /> : null,
  };

  return <ImageSelector {...mergeProps(formProps, props)} />;
}
