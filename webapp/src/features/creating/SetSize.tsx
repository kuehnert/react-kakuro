import MyInput from 'components/MyInput';
import MySelectButton from 'components/MySelectButton';
import MySlider from 'components/MySlider';
import { Form, Formik, FormikProps } from 'formik';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveStep, setBaseGame } from 'store/designSlice';
import { IBaseGame } from 'store/gameSlice';
import * as Yup from 'yup';
import { RootState } from '../../store/store';
import DesignPanel from './DesignPanel';

const minColumns = 4;

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
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const initialValues: IBaseGame = puzzle;
  // const formikRef = useRef<FormikProps<FormikValues>>(null);
  const formikRef = useRef<FormikProps<IBaseGame>>(null);

  const handleNext = () => {
    console.log('Click');
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }

    dispatch(setActiveStep(activeStep + 1));
  };

  const handleSubmit = (values: IBaseGame) => {
    dispatch(setBaseGame(values));
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={PuzzleSchema}
      innerRef={formikRef}>
      {({ setFieldValue, values }) => (
        <DesignPanel handleNext={handleNext}>
          <Form>
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

            {/* <Button type='submit' label='Set Size' className='' /> */}
          </Form>
        </DesignPanel>
      )}
    </Formik>
  );
};

export default SetSize;
