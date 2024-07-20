export function shuffleArray(items: any[], keepFirst = false) {
  let first = keepFirst ? items.shift() : null;

  let currentIndex = items.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = items[currentIndex];
    items[currentIndex] = items[randomIndex];
    items[randomIndex] = temporaryValue;
  }

  if (first) {
    items.unshift(first);
  }

  return [...items];
}
