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
    <div className='p-field'>
      <label htmlFor={field}>
        {label}: {values[field]}
      </label>

      <Slider
        id={field}
        value={values[field]}
        onChange={event => handleChange(event)}
        min={min}
        max={max}
      />
    </div>
  );
};

export default MySlider;
