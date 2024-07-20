import {Link, Navigate, Outlet, useLocation} from 'react-router-dom';
import {Fragment, useEffect, useRef} from 'react';
import {IconButton} from '../../ui/buttons/icon-button';
import {CloseIcon} from '../../icons/material/Close';
import {Button} from '../../ui/buttons/button';
import {appearanceState, AppearanceValues} from './appearance-store';
import {useSaveAppearanceChanges} from './requests/save-appearance-changes';
import {useAppearanceValues} from './requests/appearance-values';
import {Trans} from '../../i18n/trans';
import {useForm, useFormContext} from 'react-hook-form';
import {Form} from '../../ui/forms/form';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {SectionHeader} from './section-header';
import {FileUploadProvider} from '../../uploads/uploader/file-upload-provider';
import {useAppearanceEditorMode} from './commands/use-appearance-editor-mode';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';
import clsx from 'clsx';
import {useSettings} from '../../core/settings/use-settings';

export function AppearanceLayout() {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {data} = useAppearanceValues();
  const {base_url} = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {pathname} = useLocation();
  const isMobile = useIsMobileMediaQuery();

  useEffect(() => {
    // only set defaults snapshot once on route init
    if (data?.defaults && !appearanceState().defaults) {
      appearanceState().setDefaults(data.defaults);
    }
  }, [data]);

  useEffect(() => {
    if (iframeRef.current) {
      appearanceState().setIframeWindow(iframeRef.current.contentWindow!);
    }
  }, []);

  useEffect(() => {
    const sectionName = pathname.split('/')[3];
    appearanceState().preview.navigate(sectionName);
  }, [pathname]);

  // make sure appearance editor iframe can't be nested
  if (isAppearanceEditorActive) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="md:flex items-center h-full">
      <StaticPageTitle>
        <Trans message="Appearance" />
      </StaticPageTitle>
      <Sidebar values={data?.values} />
      <div className="flex-auto h-full relative">
        <iframe
          ref={iframeRef}
          className={clsx('w-full h-full', isMobile && 'hidden')}
          src={`${base_url}?appearanceEditor=true`}
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  values: AppearanceValues | undefined;
}
function Sidebar({values}: SidebarProps) {
  const spinner = (
    <div className="flex items-center justify-center flex-auto h-full">
      <ProgressCircle isIndeterminate aria-label="Loading editor" />
    </div>
  );

  return (
    <Fragment>
      <div className="bg relative w-full md:w-320 shadow-lg border-r h-full z-10">
        {values ? <AppearanceForm defaultValues={values} /> : spinner}
      </div>
    </Fragment>
  );
}

interface AppearanceFormProps {
  defaultValues: AppearanceValues;
}
function AppearanceForm({defaultValues}: AppearanceFormProps) {
  const form = useForm<AppearanceValues>({defaultValues});
  const {watch, reset} = form;
  const saveChanges = useSaveAppearanceChanges();

  useEffect(() => {
    const subscription = watch(value => {
      appearanceState().preview.setValues(value as AppearanceValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Form
      className="h-full flex flex-col"
      form={form}
      onSubmit={values => {
        saveChanges.mutate(values, {
          onSuccess: () => reset(values),
        });
      }}
    >
      <Header isLoading={saveChanges.isLoading} />
      <SectionHeader />
      <div className="px-14 py-20 flex-auto overflow-y-auto">
        <FileUploadProvider>
          <Outlet />
        </FileUploadProvider>
      </div>
    </Form>
  );
}

interface HeaderProps {
  isLoading: boolean;
}
function Header({isLoading}: HeaderProps) {
  const {
    formState: {dirtyFields},
  } = useFormContext<AppearanceValues>();
  const isDirty = Object.keys(dirtyFields).length;
  return (
    <div className="border-b flex items-center h-50 pr-10 flex-shrink-0">
      <IconButton
        border="border-r"
        className="text-muted"
        elementType={Link}
        to=".."
      >
        <CloseIcon />
      </IconButton>
      <div className="pl-10">
        <Trans message="Appearance editor" />
      </div>
      <Button
        variant="flat"
        color="primary"
        className="block ml-auto"
        disabled={!isDirty || isLoading}
        type="submit"
      >
        {isDirty ? <Trans message="Save" /> : <Trans message="Saved" />}
      </Button>
    </div>
  );
}
