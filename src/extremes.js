// find extreme values in two cardinal and diagonal directions


// getExtremes() find extreme values based on a set of given comparisons
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

module.exports = Extremes;
