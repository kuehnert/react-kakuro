import { ToggleButton } from 'primereact/togglebutton';
import classnames from 'classnames';
import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  autoPencil,
  increaseZoom,
  setGuess,
  toggleMarkWrong,
} from '../../store/gameSlice';
import { RootState } from '../../store/store';
import styles from './Controls.module.scss';
import GuessButton from './GuessButton';

/*
 * Here be number buttons for guesses and pencil marks
 */
const Controls: React.FC = () => {
  const { selectedIndex, zoomLevel, markWrong } = useSelector(
    (state: RootState) => state.game
  );
  const dispatch = useDispatch();
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleZoom = (delta: number) => dispatch(increaseZoom(delta));

  const handleDeleteClick = (event: React.MouseEvent) => {
    if (selectedIndex) {
      dispatch(setGuess({ index: selectedIndex, guess: 0 }));
    }
  };

  const handleAutoPencil = (event: React.MouseEvent) => {
    dispatch(autoPencil());
  };

  const renderButton = (digit: number, pencilMark: boolean) => {
    return <GuessButton key={digit} digit={digit} pencilMark={pencilMark} />;
  };

  return (
    <aside className={classnames('controls', styles.controls)}>
      <div className={styles.zoomButtons}>
        <Button
          className={'p-button-lg'}
          icon='mdi mdi-magnify-minus'
          onClick={() => handleZoom(-1)}
          disabled={zoomLevel < 1}
        />
        <Button
          className={'p-button-lg'}
          label='100 %'
          onClick={() => handleZoom(0)}
        />
        <Button
          className={'p-button-lg'}
          icon='mdi mdi-magnify-plus'
          onClick={() => handleZoom(1)}
          disabled={zoomLevel > 10}
        />
      </div>

      <div className={styles.guessButtons}>
        <div className={styles.columns}>
          {digits.map(d => renderButton(d, true))}
        </div>

        <Button
          className={classnames(
            'button',
            'is-warning',
            'is-large',
            styles.button
          )}
          onClick={handleDeleteClick}>
          Delete
        </Button>

        <Button
          className={classnames('button is-large', styles.button)}
          onClick={handleAutoPencil}>
          Auto Pencil
        </Button>

        <div className={styles.columns}>
          {digits.map(d => renderButton(d, false))}
        </div>
      </div>

      <div className=''>
        <ToggleButton
          checked={markWrong}
          onLabel='Show mistakes'
          offLabel='Hide mistakes'
          onChange={() => dispatch(toggleMarkWrong())}
        />
      </div>
    </aside>
  );
};

export default Controls;
