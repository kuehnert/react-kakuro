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
    <div className='field grid'>
      {/* <label htmlFor={name} className='block text-900 font-medium mb-2'> */}
      <label htmlFor={name} className='col-12 mb-2 md:col-2 md:mb-0'>
        {label}
      </label>

      <div className='col-12 md:col-10'>
        {/* <Field {...props} className='w-full mb-3' /> */}
        <Field {...props} className="inputfield w-full" />
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
