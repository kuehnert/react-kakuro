import MyInput from 'components/MyInput';
import MySelectButton from 'components/MySelectButton';
import MySlider from 'components/MySlider';
import { Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBaseGame } from 'store/designSlice';
import { IBaseGame } from 'store/gameSlice';
import * as Yup from 'yup';
import { RootState } from '../../store/store';

const minColumns = 3;

const difficulties = [
  {
    label: 'Easy',
    value: 0,
  },
  {
    label: 'Medium',
    value: 1,
  },
  {
    label: 'Medium Plus',
    value: 2,
  },
  {
    label: 'Hard',
    value: 3,
  },
  {
    label: 'Very Hard',
    value: 4,
  },
];

const PuzzleSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  level: Yup.number().min(0).max(4).required(),
  columnCount: Yup.number()
    .min(minColumns, `Must be between ${minColumns} and 30`)
    .max(30)
    .required('Required'),
  rowCount: Yup.number()
    .min(minColumns, `Must be between ${minColumns} and 30`)
    .max(30)
    .required('Required'),
});

const SetSize: React.FC = () => {
  const dispatch = useDispatch();
  const { puzzle } = useSelector((state: RootState) => state.design);
  const initialValues: IBaseGame = puzzle;

  const handleSubmit = (values: IBaseGame) => {
    dispatch(setBaseGame(values));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={PuzzleSchema}>
      {({ setFieldValue, values }) => (
        <Form className=''>
          <MyInput name='name' label='Puzzle Name' as={InputText} />

          <MySelectButton
            field='level'
            label='Difficulty'
            setFieldValue={setFieldValue}
            options={difficulties}
            values={values}
          />

          <MySlider
            field='columnCount'
            label='Columns Across'
            setFieldValue={setFieldValue}
            min={minColumns}
            max={40}
            values={values}
          />

          <MySlider
            field='rowCount'
            label='Rows Down'
            setFieldValue={setFieldValue}
            min={minColumns}
            max={40}
            values={values}
          />

          {/* <Button type='submit' label='Set Size' className='p-mt-2' /> */}
          <Button type='submit' label='Set Size' className='' />
        </Form>
      )}
    </Formik>
  );
};

export default SetSize;
