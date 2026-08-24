export function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "",
    quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i],
      n = line[i + 1];
    if (c === '"' && quoted && n === '"') {
      current += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  cells.push(current.trim());
  return cells;
}
