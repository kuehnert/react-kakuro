import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { setPuzzleState } from 'store/designSlice';
import { IGameData } from 'store/gameSlice';
import styles from './ImportDialog.module.scss';

const SetSize: React.FC = () => {
  const [importVisible, setImportVisible] = useState(false);
  const [puzzleJSON, setPuzzleJSON] = useState('');
  const dispatch = useDispatch();

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        if (reader.result) {
          setPuzzleJSON(reader.result as string);
        }
      };

      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleImport = (e: React.MouseEvent) => {
    const newPuzzle: IGameData = JSON.parse(puzzleJSON);
    setImportVisible(false);
    dispatch(setPuzzleState({ activeStep: 1, puzzle: newPuzzle }));
  };

  return (
    <>
      <Button
        label='Import Puzzle'
        icon='mdi mdi-import'
        onClick={() => setImportVisible(true)}
        className={styles.button}
      />

      <Dialog
        header='Spiel importieren'
        visible={importVisible}
        className={styles.dialog}
        modal
        onHide={() => setImportVisible(false)}>
        <div
          {...getRootProps()}
          // className={classNames(isDragActive && styles.dragging)}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </>
          )}
          <InputTextarea
            className={classNames(
              styles.textarea,
              isDragActive && styles.dragging
            )}
            // style={{ width: '100%', height: '70vh' }}
            value={puzzleJSON}
            onChange={event => setPuzzleJSON(event.target.value)}
          />
        </div>

        <Button
          label='Import'
          onClick={handleImport}
          disabled={puzzleJSON === ''}
          className={styles.button}
        />
      </Dialog>
    </>
  );
};

export default SetSize;
