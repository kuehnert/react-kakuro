/* eslint-disable react-hooks/exhaustive-deps */
import MyInput from 'components/MyInput';
import { Form, Formik } from 'formik';
import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store/store';
import { ISigninValues, login } from 'store/userSlice';

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);
  // const [checked, setChecked] = useState(false);

  const initialValues: ISigninValues = {
    email: '',
    password: '',
  };

  const handleSubmit = (values: ISigninValues) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (user) {
      myHistory.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
            Welcome Back to Mr K.'s Kakuro
          </div>
          <span className='text-600 font-medium line-height-3'>
            Don't have an account?
          </span>
          <Link
            className='font-medium no-underline ml-2 text-blue-500 cursor-pointer'
            to='/signup'>
            Create one today!
          </Link>
        </div>

        <Formik
          // enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          // validationSchema={UserSchema}
        >
          {({ setFieldValue, values }) => (
            <Form className='p-fluid'>
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
                label='Sign In!'
                icon='mdi mdi-login-variant'
                className='w-full'
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
