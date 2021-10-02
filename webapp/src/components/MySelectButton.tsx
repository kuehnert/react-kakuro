import {
  SelectButton,
  SelectButtonChangeParams,
} from 'primereact/selectbutton';
import React from 'react';

interface Props {
  field: string;
  label: string;
  values: { [key: string]: any };
  options: any;
  setFieldValue: (label: string, newValue: number) => void;
}

const MySlider: React.FC<Props> = ({
  values,
  field,
  label,
  options,
  setFieldValue,
}) => {
  const handleChange = (event: SelectButtonChangeParams) => {
    setFieldValue(field, event.value as number);
  };

  return (
    <div className='field grid'>
      <label htmlFor={field} className='col-12 mb-2 md:col-2 md:mb-0'>
        {label}
      </label>

      <div className='col-12 md:col-10'>
        <SelectButton
          id={field}
          value={values[field]}
          options={options}
          onChange={event => handleChange(event)}
          className='justify-content-start'
        />
      </div>
    </div>
  );
};

export default MySlider;
