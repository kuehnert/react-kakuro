import fs from 'fs';
import cheerio from 'cheerio';

const html = fs.readFileSync('./menneske-sample.html').toLocaleString();

const dom = cheerio.load(html);
const cells = dom('table.kakurotable > tbody > tr > td');

const columns = dom('table.kakurotable > tbody > tr').length;
const rows = cells.length / columns
console.log(columns);
console.log(rows);


let puzzleString = "";

cells.each((_i, c) => {
  const cl = dom(c).attr('class');
  if (cl === 'black' || cl === 'infocell') {
    puzzleString += '0';
  } else {
    puzzleString += dom(c).text();
  }
})

console.log(puzzleString);
// #bodycol > div > table.kakurotable > tbody > tr:nth-child(1) > td:nth-child(1)
