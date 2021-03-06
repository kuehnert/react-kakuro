// import fs from 'fs';
const cheerio = require('cheerio');
const axios = require('axios');

const difficulties = {
  'easy': 0,
  'medium': 1,
  'hard': 2,
  'very hard': 3,
  'super hard': 4,
};

async function import_menneske(size = '10x10') {
  // safe bet for now
  const number = Math.floor(Math.random() * 2000);
  const url = `https://menneske.no/kakuro/${size}/eng/solution.html?number=${number}`;

  try {
    console.log(`Getting url ${url}...`);

    const res = await axios.get(url);
    // console.log('res', res);
    const html = res.data;
    // console.log('html', html);
    // const html = fs.readFileSync('./menneske-sample.html').toLocaleString();

    const dom = cheerio.load(html);
    const rowCount = dom('table.kakurotable > tbody > tr').length;
    if (rowCount === 0) {
      return { error: 'Error downloading puzzle' };
    }

    const cells = dom('table.kakurotable > tbody > tr > td');
    const columnCount = cells.length / rowCount;
    let cellString = '';

    cells.each((_i, c) => {
      const cl = dom(c).attr('class');
      if (cl === 'black' || cl === 'infocell') {
        cellString += '0';
      } else {
        cellString += dom(c).text();
      }
    });

    console.log(cellString);
    // #bodycol > div > table.kakurotable > tbody > tr:nth-child(1) > td:nth-child(1)
    const puzzle = {
      name: `${columnCount}x${rowCount} Number ${number}`,
      level: 0,
      cellString,
      columnCount,
      rowCount,
    };

    // console.log('puzzle:', puzzle);
    return puzzle;
  } catch (error) {
    console.error(error);
    return { error: 'Error loading puzzle' };
  }
}

module.exports = import_menneske;
