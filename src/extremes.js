// find extreme values in two cardinal and diagonal directions

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

// find extreme values based on a set of given comparisons
//
// fs : an array of comparison functions
// acc : accumulator an array of previous extreme points
// point: the point pressently tested
// init: array of initial points, size identical as fs
// points: array of points
//
// extremesReducer :: [(Point -> Point -> Bool)] -> [Point]-> Point -> [Point]
const extremesReducer = fs => (acc, point) => fs.map((f, i) => f(point)(acc[i]) ? point : acc[i]);

// getExtremes ::  [(Point -> Point -> Bool)] -> [Point]-> [Point] -> [Point]
const getExtremes = fs => (points, init) => points.reduce(extremesReducer(fs), init);


// initialAccumulator :: a -> [a]
const makeInitAccu = n => p => Array(n).fill(p);

// object of comparison functions
// comparisons :: { ({x, y} -> {x, y} -> Bool) }
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


// class constructor takes array of points
// properties are an array of points at extrema for cardinal and diagonal
// directions and an array of a unique set of these points.
class Extremes {
  // Extremes :: [Point]-> { {Point}, [Point] }
  constructor(points) {
    // fill first accumulator for reduce function, each element will
    // hold a
    const directions = Object.keys(comparisons);

    const nAccu = directions.length;
    const initAccu = makeInitAccu(nAccu)(points[0]);

    const results = getExtremes(Object.values(comparisons))(points, initAccu);

    this.points = directions.reduce((o, k, i) => ({...o, ...{[k]: results[i]}}), {});
    this.uniquePoints = [...new Set(results)];
  }
}

// playground

// const testData = [{x: -8.6275002991549732e-1, y: 2.1950365294723881e+0}, {x: -1.1581276285911100e+0, y: 4.4714060766845892e-1}, {x: -5.3341769652537752e-1, y: 9.2113479535343448e-2}, {x: 1.7916941213047131e+0, y: -6.5529931692023446e-1}, {x: 8.4969496829307867e-1, y: 5.9068417123523942e-1}, {x: 1.2517606947321041e+0, y: 1.1306641928423220e+0}, {x: 7.5332876766338253e-1, y: 1.2619914771703871e+0}, {x: 1.3939297111650211e+0, y: 1.1851959965915191e+0}, {x: -1.1558792972549040e-1, y: -1.1015072997771569e+0}, {x: 2.9021808386159231e-1, y: 1.7112931670997580e-1}, {x: 4.3520344634378189e-1, y: -6.9766608357422299e-1}, {x: -9.4238979897843167e-1, y: 8.9216427438054402e-1}, {x: -1.0521659017714149e+0, y: -1.6098394619863010e+0}, {x: -7.3803834300428484e-1, y: 4.8772678534742209e-1}, {x: 1.2251727713636980e+0, y: -1.0496446295952879e+0}, {x: 2.5528939941495010e-1, y: 8.7085087568659469e-1}];

module.exports = Extremes;
