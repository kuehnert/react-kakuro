import fileDownload from 'js-file-download';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './SaveGame.module.scss';

const ExportButton: React.FC = () => {
  const [exportVisible, setExportVisible] = useState(false);
  const [puzzleJSON, setPuzzleJSON] = useState('');
  const { puzzle } = useSelector((state: RootState) => state.design);

  useEffect(() => {
    if (exportVisible) {
      setPuzzleJSON(JSON.stringify(puzzle, null, 4));
    }
  }, [exportVisible, puzzle]);

  const handleDownload = () => {
    const blob = new Blob([puzzleJSON]);
    const filename = `kakuro-${puzzle.columnCount}x${puzzle.rowCount}.json`;
    fileDownload(blob, filename);
  };

  return (
    <>
      <Button
        label='Export Puzzle'
        icon='mdi mdi-export'
        onClick={() => setExportVisible(true)}
        className={styles.button}
      />

      <Dialog
        header='Spiel exportieren'
        visible={exportVisible}
        style={{ width: '50vw', height: '70vh' }}
        modal
        onHide={() => setExportVisible(false)}>
        <InputTextarea
          rows={8}
          style={{ width: '100%', height: 'calc(100% - 48px)', fontFamily: 'monospace' }}
          value={puzzleJSON}
        />
        <Button
          icon='mdi mdi-download'
          label='Download'
          className={styles.button}
          onClick={handleDownload}
        />
        <Button
          icon='mdi mdi-close'
          label='Close'
          className={styles.button}
          onClick={() => setExportVisible(false)}
        />
      </Dialog>
    </>
  );
};

export default ExportButton;
