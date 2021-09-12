async function loadGame() {
  const res = await fetch('/puzzles/sample.json', { mode: 'cors' });
  const data = await res.json();
  console.log('data:', data);
  return data;
}

export default loadGame;
