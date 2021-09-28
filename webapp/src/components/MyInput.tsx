import { ErrorMessage, Field } from 'formik';
import React from 'react';

interface Props {
  name: string;
  label: string;
  as: any;
  hint?: string;
  [key: string]: any;
}

const MyInput: React.FC<Props> = props => {
  const { label, name, hint } = props;

  return (
    <div className='p-field'>
      <label htmlFor={name} className='block text-900 font-medium mb-2'>
        {label}
      </label>

      <div>
        <Field {...props} className='w-full mb-3' />
        {hint && <div dangerouslySetInnerHTML={{ __html: hint }} />}
        <ErrorMessage
          name={name}
          component='div'
          className='fieldErrorMessage'
        />
      </div>
    </div>
  );
};

export default MyInput;
