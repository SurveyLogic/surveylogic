import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import {FocusEventHandler, ReactNode} from 'react';

interface Props<T extends FieldValues> {
  children: ReactNode;
  form: UseFormReturn<T>;
  className?: string;
  onSubmit: SubmitHandler<T>;
  onBeforeSubmit?: () => void;
  onBlur?: FocusEventHandler<HTMLFormElement>;
  id?: string;
}
export function Form<T extends FieldValues>({
  children,
  onBeforeSubmit,
  onSubmit,
  form,
  className,
  id,
  onBlur,
}: Props<T>) {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        onBlur={onBlur}
        className={className}
        onSubmit={e => {
          // prevent parent forms from submitting, if nested
          e.stopPropagation();
          onBeforeSubmit?.();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
}
