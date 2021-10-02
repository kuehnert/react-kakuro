import { InputNumber } from 'primereact/inputnumber';
import { Slider, SliderChangeParams } from 'primereact/slider';
import React from 'react';

interface Props {
  field: string;
  label: string;
  values: { [key: string]: any };
  min?: number;
  max?: number;
  setFieldValue: (label: string, newValue: number) => void;
}

const MySlider: React.FC<Props> = ({
  values,
  field,
  label,
  setFieldValue,
  min,
  max,
}) => {
  const handleChange = (event: SliderChangeParams) => {
    setFieldValue(field, event.value as number);
  };

  return (
    <div className='field grid'>
      <label htmlFor={field} className='col-12 mb-2 md:col-2 md:mb-0'>
        {label}
      </label>

      <div className='col-12 md:col-10'>
        <InputNumber
          value={values[field]}
          onChange={event => handleChange(event)}
          className='inputfield w-full'
        />

        <Slider
          id={field}
          value={values[field]}
          onChange={event => handleChange(event)}
          min={min}
          max={max}
          className='inputfield w-full'
        />
      </div>
    </div>
  );
};

export default MySlider;
