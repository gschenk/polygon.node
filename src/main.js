// polygon
//
// This programme receives from STDIN a json formatted line containing
// a set of points x-y--coordinates and returns the area of the convex hull.
// That is the smallest polygon to include contain all points.
//
// Example input: [{"x":-1.4e-1,"y":2.19e+0},{"x":3.14e+0,"y":42}]
//
// The programme returns the area as a single datum (Float or Int) to STDOUT.
//
// Small sets (less than 3k data) are filtered for duplicates.
//
// Points with extreme x or y values, as well as extreme x+y and x-y values
// are selected to form an initial polygon P_0. In some cases where only
// two points are found a slow secondary strategy is used to find extra points.
//
// A recursive search is used for every edge of P_0 to find edges of the convex
// hull.

const ReadlineWrapper = require('./readlineWrapper');

const Parse = require('./parse');
const PolyNode = require('./polynode');
const Edge = require('./edge');
const Polygon = require('./polygon');
const Extremes = require('./extremes');
const {recursiveEdgeChaining} = require('./recursiveEdgeChaining');

const ErrorLog = require('./errorlog');

// create edges from ordered set of nodes
// createEdges :: [PolyNode] -> Point -> [Edge]
function createEdges(nodes, centre) {
  // moveFirstToLast [a] -> [a]
  const moveFirstToLast = as => [...as.slice(1), as[0]];

  // re-ordered list of nodes
  const nPrime = moveFirstToLast(nodes);

  return nodes.map(
    (n, i) => new Edge(n, nPrime[i], centre),
  );
}

// Find a polygon P_0 based on easy to find convex hull points
// findPolyZero :: Points -> Polygon
function findPolyZero(points) {
  // get points at extreme cardinal and diagonal directions
  const extremes = new Extremes(points);

  // extreme points are nodes of P_0
  // these points are certain to be nodes of the convex hull
  const nodesZero = extremes.uniquePoints.map(p => new PolyNode(p));

  // put polygon P_0 together
  const polyZero = new Polygon(0, nodesZero);

  // define a point at geometric mean of polyZero
  const {centre} = polyZero;


  // create edges from ordered set of nodes
  const edgesZero = createEdges(nodesZero, centre);

  // add edges to poly
  // edges are checked to form a linked chain
  edgesZero.map(e => polyZero.addEdge(e));

  return polyZero;
}

// Warning: Side effects
// Recursively find edges of convex hull based on an edge of P_0
// setOutsidePointsToEdges :: Polygon -> [Point] -> undefined
function setOutsidePointsToEdges(poly, points) {
  const reducer = (ps, e) => ps.map(p => e.findOutsidePoints(p)).filter(a => a);
  poly.edges.reduce(reducer, points);
  return undefined;
}

// create logging object
const errorlog = new ErrorLog(console.error);

// read input from STDIN
const readline = new ReadlineWrapper().stdin;

// read line and process
readline.on('line', line => {
  // const points = parseJsonPoints(line);
  const points = Parse.pointsJSON(line);

  if (points.length <= 2) {
    console.log(0);
    return 0;
  }

  // construct polygon P_0
  const polyZero = findPolyZero(points);

  // check for degenerate case
  const zeroDoubleArea = polyZero.edges
    .map(e => e.det)
    .map(x => Math.abs(x) < 2 * Number.EPSILON ? 0 : x)
    .reduce((sum, x) => sum + x);

  if (zeroDoubleArea < 2 * Number.EPSILON) {
    console.log(0);
    return 0;
  }

  // find all points outside of edges of P_0
  setOutsidePointsToEdges(polyZero, points);


  // go through all edges of P_0 to find P_f recursively
  const initNode = new PolyNode(polyZero.nodes[0].point);
  const {centre} = polyZero;

  const initAccu = {nodes: [initNode], edges: [], depth: []};
  const finalNodesEdges = polyZero.edges
    .reduce((accu, e) => recursiveEdgeChaining(accu, e, centre, 0), initAccu);

  // create polygon of convex hull with nodes and edges from finalNodesEdges
  const convexHull = new Polygon(1, [...new Set(finalNodesEdges.nodes)]);

  // add edges to poly
  // edges are checked to form a linked chain
  finalNodesEdges.edges.map(e => convexHull.addEdge(e));

  const area = convexHull.isClosed
    ? convexHull.edges
      .map(e => e.detCent / 2)
      .reduce((sum, x) => sum + x)
    : NaN;

  if (area.isNaN) {
    errorlog.set(
      'Final polygon is not closed! Edges are missing.',
      points,
      convexHull.nodes,
      convexHull,
    );
  }

  // regular output
  if (Math.abs(area) < 8 * Number.EPSILON) {
    console.log(0);
  } else if (area < 0) {
    // negative area might be a bad sign
    errorlog.set(
      `Error: Area (${area}) smaller than zero.`,
      points,
      convexHull.nodes,
      (convexHull.edges.map(e => e.det)),
    );
    console.log(0);
  } else {
    console.log(area);
  }

  return 0; // end of readline 'line' callback
}).on('close', () => { errorlog.printAll(); });
