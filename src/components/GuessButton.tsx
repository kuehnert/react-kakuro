/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
// import styles from './BlankCell.module.scss';

export interface Props {
  digit: number;
}

const GuessButton: React.FC<Props> = ({ digit }) => {
  const handleGuessClick = (event: React.MouseEvent) => {
    console.log('event', event);
    console.log('digit', digit);
  };

  return (
    <button
      className={classnames('gamecell')}
      onClick={handleGuessClick}>{digit}</button>
  );
};

export default GuessButton;
