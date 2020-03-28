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
// extremesReducer :: Char => (Point -> Point -> Bool) -> Point -> [Point] -> [Point]
const extremesReducer = f => (accumulator, point) => {
  const isAfter = f(...accumulator.slice(-1))(point);
  if (isAfter) return accumulator;

  const isBefore = f(point)(accumulator[0]);
  if (isBefore) return [point, ...accumulator.slice(0, -1)];

  // otherwise it is in-between
  return sortIn(f)(point)(accumulator).slice(0, -1);
};

const getExtremes = (ps, init) => f => ps.reduce(extremesReducer(f), init);

// initialAccumulator :: a -> [a]
const initialAccumulator = n => p => Array(n).fill(p);

const comparisons = {
  left: a => b => a.x < b.x,
  bottomLeft: a => b => a.x + a.y < b.x + b.y,
  bottom: a => b => a.y < b.y,
  bottomRight: a => b => a.x - a.y > b.x - b.y,
  right: a => b => a.x > b.x,
  topRight: a => b => a.x + a.y > b.x + b.y,
  top: a => b => a.y > b.y,
  topLeft: a => b => a.y - a.x > b.y - b.x,
};


class Extremes {
  // Extremes :: Int -> (Point -> [Point] -> [Point])
  constructor(nAccu, points) {
    const n = nAccu < MAXCOLLECTOR ? nAccu : MAXCOLLECTOR;

    const initAccu = initialAccumulator(n)(points[0]);

    const lists = Object.keys(comparisons)
      .map(k => ({[k]: getExtremes(points, initAccu)(comparisons[k])}))
      .reduce((os, o) => ({...os, ...o}), {});


    // the first point when closing from [key] direction
    const firsts = Object.keys(lists)
      .map(k => ({[k]: lists[k][0]}))
      .reduce((os, o) => ({...os, ...o}), {});

    this.lists = lists;
    this.firsts = firsts;
    this.uniquePoints = [...new Set(Object.values(firsts))];
  }
}

module.exports = Extremes;
