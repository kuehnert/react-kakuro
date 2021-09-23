import React, { useEffect, useState } from 'react';
import { Steps } from 'primereact/steps';
import styles from './CreateGame.module.scss';
import { Card } from 'primereact/card';
import { Slider } from 'primereact/slider';
import { CellType, IBlankCell, ICell } from 'store/gameSlice';
import BlankCell from 'features/playing/BlankCell';

const CreateGame: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [cells, setCells] = useState<ICell[]>([]);

  const items = [
    { label: 'Set Size' },
    { label: 'Draw Grid' },
    { label: 'Insert Hints' },
    { label: 'Check Puzzle' },
  ];

  useEffect(() => {
    setCells(
      Array.from({ length: width * height }, (item, index) => {
        return {
          index,
          type: CellType.Blank,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div className={styles.createGame}>
      <Card>
        <h1>Create a new game</h1>
        <Steps model={items} activeIndex={activeStep} />
      </Card>

      <Card title={items[activeStep].label}>
        <h5>Breite: {width}</h5>
        <Slider
          value={width}
          onChange={e => setWidth(e.value as number)}
          min={5}
          max={40}
        />
        <h5>Höhe: {height}</h5>
        <Slider
          value={height}
          onChange={e => setHeight(e.value as number)}
          min={5}
          max={40}
        />
      </Card>

      <Card title='Grid'>
        <div className={styles.gameBackground}>
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${width}, 1fr)`,
            }}>
            {cells.map((c, i) => (
              <BlankCell key={i} index={i} cell={c as IBlankCell} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateGame;
