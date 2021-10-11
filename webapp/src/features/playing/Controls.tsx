import { confirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { ToggleButton } from 'primereact/togglebutton';
import classnames from 'classnames';
import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  autoPencil,
  clearPencilMarks,
  increaseZoom,
  PuzzleStates,
  redo,
  resetGame,
  setGuess,
  toggleMarkWrong,
  togglePencilMark,
  undo,
} from '../../store/gameSlice';
import { RootState } from '../../store/store';
import styles from './Controls.module.scss';
import GuessButton from './GuessButton';

/*
 * Here be number buttons for guesses and pencil marks
 */
const Controls: React.FC = () => {
  const { selectedIndex, zoomLevel, markWrong, game, undoStack, redoStack } =
    useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleZoom = (delta: number) => dispatch(increaseZoom(delta));

  const handleDelete = (event: React.MouseEvent) => {
    if (selectedIndex) {
      dispatch(setGuess({ index: selectedIndex, guess: 0 }));
    }
  };

  const handleRestart = (event: React.MouseEvent) => {
    confirmDialog({
      message: 'Are you sure you want to start over?',
      header: 'Warning',
      icon: 'pi pi-exclamation-triangle',
      accept: () => dispatch(resetGame()),
      // reject: () => rejectFunc()
  });


  };

  const handleClearPencilMarks = (event: React.MouseEvent) => {
    dispatch(clearPencilMarks());
  };

  const handleDeletePencilMarks = (event: React.MouseEvent) => {
    if (selectedIndex) {
      dispatch(togglePencilMark({ index: selectedIndex, guess: 0 }));
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
          icon='mdi mdi-pencil-off'
          label='Delete'
          onClick={handleDeletePencilMarks}
        />

        <Button
          className={classnames('button is-large', styles.button)}
          onClick={handleAutoPencil}
          label='Auto Pencil'
          icon='mdi mdi-pencil'
        />

        <Button
          className={classnames('button is-large', styles.button)}
          onClick={handleClearPencilMarks}
          label='Clear Pencil Marks'
          icon='mdi mdi-pencil-off'
        />

        <div className={styles.columns}>
          {digits.map(d => renderButton(d, false))}
        </div>

        <Button
          className={classnames(
            'button',
            'is-warning',
            'is-large',
            styles.button
          )}
          icon='mdi mdi-delete'
          label='Delete'
          onClick={handleDelete}
        />

        <Button
          className={classnames(
            'button',
            'p-warning-button',
            'is-large',
            styles.button
          )}
          icon='mdi mdi-restart'
          label='Start Over'
          onClick={handleRestart}
        />
      </div>

      <div className=''>
        {game.state === PuzzleStates.Solved && (
          <ToggleButton
            checked={markWrong}
            onLabel='Show mistakes'
            offLabel='Hide mistakes'
            onIcon='mdi mdi-eye'
            offIcon='mdi mdi-eye-off'
            onChange={() => dispatch(toggleMarkWrong())}
          />
        )}
      </div>
      <div className='undoredo'>
        <Button
          className={classnames('button', 'p-button-large', styles.button)}
          icon='mdi mdi-undo'
          label='Undo'
          onClick={() => dispatch(undo())}
          disabled={undoStack.length === 0}
        />

        <Button
          className={classnames('button', 'p-warning-button', styles.button)}
          icon='mdi mdi-redo'
          label='Redo'
          onClick={() => dispatch(redo())}
          disabled={redoStack.length === 0}
        />
      </div>

      <div className='debug'>
        <div>Missing: {game.missingCells}</div>
        <div>Selected: {selectedIndex}</div>
      </div>
    </aside>
  );
};

export default Controls;
