import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { designSteps } from 'store/designSlice';
import { RootState } from '../../store/store';
import ExportButton from './ExportButton';

interface Props {
  children?: JSX.Element | JSX.Element[];
  handleBack?: () => void;
  handleNext?: () => void;
}

const DesignPanel: FunctionComponent<Props> = props => {
  const { handleBack, handleNext, children } = props;
  const { activeStep } = useSelector((state: RootState) => state.design);

  const headerTemplate = (options: any) => {
    const className = `${options.className} p-jc-start`;
    const titleClassName = `${options.titleClassName} p-pl-1`;

    return (
      <div className={className}>
        <span className={titleClassName}>
          Step {activeStep + 1}: {designSteps[activeStep].label}
        </span>

        <span className={titleClassName}>
          <ExportButton />

          <Button
            label='Back'
            icon='mdi mdi-arrow-left'
            onClick={handleBack}
            disabled={handleBack == null}
            type='button'
          />

          <Button
            label='Next'
            icon='mdi mdi-arrow-right'
            onClick={handleNext}
            // disabled={activeStep === designSteps.length - 1}
            disabled={handleNext == null}
            type='button'
          />
        </span>
      </div>
    );
  };

  return <Panel headerTemplate={headerTemplate}>{children}</Panel>;
};

export default DesignPanel;
