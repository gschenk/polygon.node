// find extreme values in two cardinal and two diagonal directions

const MAXCOLLECTOR = 32; // maximum length of accumulator array (recursion, stack)

// Warning! Recursion, only valid for small arrays since there is no TCO
// fits an element into an ordered list
// f is the comparison function
// xs orderd array
//
// sortIn :: (a -> a -> Bool) -> a -> [as] -> [as]
const sortIn = f => x => xs => {
  const g = sortIn(f)(x);
  const l = xs.length;
  const h = Math.ceil(l / 2);
  const head = xs.slice(0, h);
  const tail = xs.slice(h);
  const inHead = f(x)(...head.slice(-1));
  const inTail = f(tail[0])(x);
  return [
    ...inHead ? g(head) : head,
    ...inHead || inTail ? [] : [x],
    ...inTail ? g(tail) : tail,
  ];
};


// comparison in cardinal directions
// accumulator : array of points, with even number of elements
//
// getExtremes :: Char => (Point -> Point -> Bool) -> Point -> [Point] -> [Point]
const getExtremes = f => (accumulator, point) => {
  const isAfter = f(...accumulator.slice(-1))(point);
  if (isAfter) return accumulator;

  const isBefore = f(point)(accumulator[0]);
  if (isBefore) return [point, ...accumulator.slice(0, -1)];

  // otherwise it is in-between
  return sortIn(f)(point)(accumulator).slice(0, -1);
};

class Extremes {
  // Extremes :: Int -> (Point -> [Point] -> [Point])
  constructor(nAccu) {
    const n = nAccu < MAXCOLLECTOR ? nAccu : MAXCOLLECTOR;

    // initAccu :: a -> [a]
    this.initAccu = p => Array(n).fill(p);

    // minXs :: Point -> [Point] -> [Point]
    this.minXs = getExtremes(a => b => a.x < b.x);

    // maxXs :: Point -> [Point] -> [Point]
    this.maxXs = getExtremes(a => b => a.x > b.x);

    // minYs :: Point -> [Point] -> [Point]
    this.minYs = getExtremes(a => b => a.y < b.y);

    // maxYs :: Point -> [Point] -> [Point]
    this.maxYs = getExtremes(a => b => a.y > b.y);

    this.exDiaYpXn = getExtremes(a => b => a.y - a.x > b.y - b.x);
    this.exDiaXpYn = getExtremes(a => b => a.x - a.y > b.x - b.y);
    this.exDiaXpYp = getExtremes(a => b => a.x + a.y > b.x + b.y);
    this.exDiaXnYn = getExtremes(a => b => a.x + a.y < b.x + b.y);
  }
}

module.exports = Extremes;
