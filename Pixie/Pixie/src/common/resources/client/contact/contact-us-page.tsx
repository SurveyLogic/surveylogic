import {Trans} from '../i18n/trans';
import {Navbar} from '../ui/navigation/navbar/navbar';
import {Form} from '../ui/forms/form';
import {useForm} from 'react-hook-form';
import {
  ContactPagePayload,
  useSubmitContactForm,
} from './use-submit-contact-form';
import {FormTextField} from '../ui/forms/input-field/text-field/text-field';
import {Button} from '../ui/buttons/button';
import {useRecaptcha} from '../recaptcha/use-recaptcha';
import {StaticPageTitle} from '../seo/static-page-title';
import {Footer} from '@common/ui/footer/footer';

export function ContactUsPage() {
  const form = useForm<ContactPagePayload>();
  const submitForm = useSubmitContactForm(form);
  const {verify, isVerifying} = useRecaptcha('contact');

  return (
    <div className="flex flex-col bg-alt min-h-full">
      <StaticPageTitle>
        <Trans message="Contact us" />
      </StaticPageTitle>
      <Navbar
        className="flex-shrink-0 sticky top-0"
        menuPosition="contact-us-page"
      />
      <div className="container p-24 md:p-40 mx-auto flex-auto flex items-center justify-center">
        <div className="border rounded bg-paper p-24 max-w-620">
          <h1 className="text-2xl">
            <Trans message="Contact us" />
          </h1>
          <p className="text-sm mt-4 mb-30">
            <Trans message="Please use the form below to send us a message and we'll get back to you as soon as possible." />
          </p>
          <Form
            form={form}
            onSubmit={async value => {
              const isValid = await verify();
              if (isValid) {
                submitForm.mutate(value);
              }
            }}
          >
            <FormTextField
              label={<Trans message="Name" />}
              name="name"
              required
              className="mb-20"
            />
            <FormTextField
              label={<Trans message="Email" />}
              name="email"
              required
              type="email"
              className="mb-20"
            />
            <FormTextField
              label={<Trans message="Message" />}
              name="message"
              required
              inputElementType="textarea"
              className="mb-20"
              rows={8}
            />
            <Button
              type="submit"
              variant="flat"
              color="primary"
              disabled={submitForm.isLoading || isVerifying}
            >
              <Trans message="Send" />
            </Button>
          </Form>
        </div>
      </div>
      <Footer className="container mx-auto px-24 flex-shrink-0" />
    </div>
  );
}
