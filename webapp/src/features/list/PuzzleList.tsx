import { format } from 'date-fns';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { difficultyLevels } from 'types/puzzle';
import { fetchList, fetchSolved, IListGame, setChoiceID } from './listSlice';

const PuzzleList: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.users);
  const { list, choice, solved } = useSelector(
    (state: RootState) => state.list
  );
  const dispatch = useDispatch();
  const filtered = user ? list.filter(p => !solved.includes(p._id!)) : list;

  useEffect(() => {
    dispatch(fetchList());
    if (user) {
      dispatch(fetchSolved());
    }
  }, [dispatch, user]);

  const formatDate = (date: Date) => format(date, 'dd-MM-yyyy');

  const difficultyTemplate = (puzzle: IListGame) =>
    difficultyLevels[puzzle.level];

  const dateTemplate = (puzzle: IListGame) =>
    formatDate(new Date(puzzle.createdAt));

  const solvedTemplate = (puzzle: IListGame) => {
    if (!puzzle._id) {
      return 'Unknown';
    }

    return solved.includes(puzzle._id) ? <i className='mdi mdi-check'></i> : '';
  };

  return (
    // <Panel header='List of Puzzles'>
    <DataTable
      value={filtered}
      autoLayout
      stripedRows
      className='p-datatable-sm'
      scrollable
      scrollHeight='60vh'
      selectionMode='single'
      selection={choice}
      onSelectionChange={e => dispatch(setChoiceID(e.value))}
      dataKey='_id'
      style={{ width: '80vw' }}
      stateStorage='local'
      stateKey='kakuro-puzzle-list'>
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
      {user && solved && (
        <Column field='solved' header='Solved' body={solvedTemplate} />
      )}
    </DataTable>
    // </Panel>
  );
};

export default PuzzleList;
