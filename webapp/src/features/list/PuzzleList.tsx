import { format } from 'date-fns';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { difficultyLevels } from 'types/puzzle';
import { fetchList, IListGame, setChoiceID } from './listSlice';

const PuzzleList: React.FC = () => {
  const { list, choice } = useSelector((state: RootState) => state.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const formatDate = (date: Date) => format(date, 'dd-MM-yyyy');

  const difficultyTemplate = (puzzle: IListGame) =>
    difficultyLevels[puzzle.level];

  const dateTemplate = (puzzle: IListGame) =>
    formatDate(new Date(puzzle.createdAt));

  return (
    <Panel header='List of Puzzles'>
      <DataTable
        value={list}
        autoLayout
        stripedRows
        className='p-datatable-sm'
        selectionMode='single'
        selection={choice}
        onSelectionChange={e => dispatch(setChoiceID(e.value))}
        dataKey='_id'>
        <Column field='name' header='Puzzle name' sortable />
        <Column
          field='level'
          header='Difficulty'
          body={difficultyTemplate}
          filter
          sortable
        />
        <Column field='columnCount' header='Columns' sortable />
        <Column field='rowCount' header='Rows' sortable />
        <Column field='creatorName' header='Creator' filter sortable />
        <Column field='createdAt' header='Date' body={dateTemplate} sortable />
      </DataTable>
    </Panel>
  );
};

export default PuzzleList;
