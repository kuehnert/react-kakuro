import React from 'react';
import styles from './Controls.module.scss';
import classnames from 'classnames';

const Controls: React.FC = () => {
  return <aside className={classnames('controls', styles.controls)}>Controls</aside>;
};

export default Controls;
