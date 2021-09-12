import React from 'react';
import styles from './Controls.module.scss';
import classnames from 'classnames';
import GuessButton from './GuessButton'

/*
 * Here be number buttons for guesses and pencil marks
 */
const Controls: React.FC = () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const renderButton = (digit: number) => {
    return (
      <GuessButton key={digit} digit={digit} />
    );
  };

  return (
    <aside className={classnames('controls', styles.controls)}>
      <button className='numbers'>{digits.map(d => renderButton(d))}</button>
      <button className='pencilmarks'></button>
    </aside>
  );
};

export default Controls;
