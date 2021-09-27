import { SelectButton, SelectButtonChangeParams } from 'primereact/selectbutton';
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
    <div className='p-field'>
      <label htmlFor={field}>{label}</label>

      <SelectButton
        id={field}
        value={values[field]}
        options={options}
        onChange={event => handleChange(event)}
      />
    </div>
  );
};

export default MySlider;
