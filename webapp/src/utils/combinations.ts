export interface ICombinationsForCount {
  [sumSolved: string]: number[][];
}

export interface ICombinations {
  [count: string]: ICombinationsForCount;
}

const makeCombinations = () => {
  const combinations: ICombinations = {};
  const digits = new Array(10).fill(false);

  const digitsToCombination = () => {
    const set = new Array<number>();
    let count = 0;
    let sumSolved = 0;

    for (let index = 1; index < digits.length; index++) {
      if (digits[index]) {
        set.push(index);
        count += 1;
        sumSolved += index;
      }
    }

    if (!combinations[count]) {
      combinations[count] = {};
    }

    if (!combinations[count][sumSolved]) {
      combinations[count][sumSolved] = new Array<number[]>();
    }

    combinations[count][sumSolved].push(set);
  };

  const _makeCombinations = (min: number, current: number) => {
    if (current === 10) {
      digitsToCombination();
    } else {
      digits[current] = true;
      _makeCombinations(min, current + 1);
      digits[current] = false;
      _makeCombinations(min, current + 1);
      current++;
    }
  };

  for (let min = 1; min < 9; min++) {
    digits[min] = true;
    _makeCombinations(min, min + 1);
    digits[min] = false;
  }

  delete combinations['1'];
  return combinations;
};

const combinations: ICombinations = makeCombinations();
Object.freeze(combinations);

export default combinations;
