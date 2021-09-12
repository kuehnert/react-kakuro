import React from 'react';
import styles from './Controls.module.scss';
import classnames from 'classnames';
import GuessButton from './GuessButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setGuess } from '../store/gameSlice';

/*
 * Here be number buttons for guesses and pencil marks
 */
const Controls: React.FC = () => {
  const { selectedIndex } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleDeleteClick = (event: React.MouseEvent) => {
    if (selectedIndex) {
      dispatch(setGuess({ index: selectedIndex, guess: -1 }));
    }
  };

  const renderButton = (digit: number) => {
    return <GuessButton key={digit} digit={digit} />;
  };

  return (
    <aside className={classnames('controls', styles.controls)}>
      <div className='guesses'>
        <div className='columns is-1 is-multiline'>
          {digits.map(d => renderButton(d))}
        </div>

        <button
          className={classnames('button', 'is-warning', 'is-large')}
          onClick={handleDeleteClick}>
          X
        </button>
      </div>

      <div className='pencilmarks'></div>
    </aside>
  );
};

export default Controls;
