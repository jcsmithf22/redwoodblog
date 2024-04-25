import {
  CreateContactMutation,
  CreateContactMutationVariables,
} from 'types/graphql';

import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  SubmitHandler,
  TextAreaField,
  TextField,
  useForm,
} from '@redwoodjs/forms';
import { Metadata, useMutation } from '@redwoodjs/web';
import { Toaster, toast } from '@redwoodjs/web/dist/toast';

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`;

interface FormValues {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const formMethods = useForm({ mode: 'onBlur' });

  const [create, { loading, error }] = useMutation<
    CreateContactMutation,
    CreateContactMutationVariables
  >(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Message sent!');
      formMethods.reset();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (loading) return;
    create({ variables: { input: data } });
  };

  return (
    <>
      <Metadata title="Contact" description="Contact page" />

      <Toaster />

      <Form onSubmit={onSubmit} error={error} formMethods={formMethods}>
        <FormError error={error} wrapperClassName="form-error" />

        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField
          name="name"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="name" className="error" />

        <Label name="message" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />
        <Submit>{loading ? 'Saving...' : 'Save'}</Submit>
      </Form>
    </>
  );
};

export default ContactPage;
