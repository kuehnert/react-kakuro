/* eslint-disable react-hooks/exhaustive-deps */
import MyInput from 'components/MyInput';
import { Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3)
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  email: Yup.string()
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  password: Yup.string()
    .min(10, 'Must be at least 10 characters')
    .max(25, 'Must be 25 characters or less')
    .required('Required'),
});

const SignUp: React.FC = () => {
  // const [checked, setChecked] = useState(false);
  const handleSubmit = (values: any) => {
    // dispatch(setBaseGame(values));
  };

  return (
    <div
      className='flex align-items-center justify-content-center'
      style={{ height: '60%' }}>
      <div className='surface-card p-4 shadow-2 border-round w-full lg:w-6'>
        <div className='text-center mb-5'>
          {/* <img
            src='assets/images/blocks/logos/hyper.svg'
            alt='hyper'
            height={50}
            className='mb-3'
          /> */}
          <div className='text-900 text-3xl font-medium mb-3'>
            Sign Up For Mr K.'s Kakuro
          </div>
          <span className='text-600 font-medium line-height-3'>
            Already have an account?
          </span>
          <Link
            className='font-medium no-underline ml-2 text-blue-500 cursor-pointer'
            to='/signin'>
            Sign In!
          </Link>
        </div>

        <Formik
          enableReinitialize
          initialValues={{}}
          onSubmit={handleSubmit}
          validationSchema={UserSchema}>
          {({ setFieldValue, values }) => (
            <Form className='p-fluid'>
              <MyInput
                name='name'
                label='Gamer Name'
                as={InputText}
                className='block text-900 font-medium mb-2'
              />
              <MyInput
                name='email'
                label='Email'
                as={InputText}
                className='block text-900 font-medium mb-2'
              />
              <MyInput
                name='password'
                label='Password'
                type='password'
                as={InputText}
                className='block text-900 font-medium mb-2'
              />

              <Button
                type='submit'
                label='Sign Up!'
                icon='mdi mdi-account-plus'
                className='w-full'
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
