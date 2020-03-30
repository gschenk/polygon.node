const ReadlineWrapper = require('./readlineWrapper');

const Parse = require('./parse');
// const Point = require('./point');
const Node = require('./node');
const Edge = require('./edge');
const Polygon = require('./polygon');
const Extremes = require('./extremes');

const format = require('./format');
// const Polygon = require('./polygon');

// create edges from ordered set of nodes
// createEdges :: [Node] -> Point -> [Edge]
function createEdges(nodes, centre) {
  // edgeID :: {Int}-> {Int} -> Int
  const edgeID = (n, m) => Number.parseInt(`${n.id}${m.id}`, 10);

  // moveFirstToLast [a] -> [a]
  const moveFirstToLast = as => [...as.slice(1), as[0]];

  // re-ordered list of nodes
  const nPrime = moveFirstToLast(nodes);

  return nodes.map(
    (n, i) => new Edge(edgeID(n, nPrime[i]), n, nPrime[i], centre),
  );
}

// Find a polygon P_0 based on easy to find convex hull points
// findPolyZero :: Points -> Polygon
function findPolyZero(points) {
  // get points at extreme cardinal and diagonal directions
  const extremes = new Extremes(points);

  // extreme points are nodes of P_0
  // these points are certain to be nodes of the convex hull
  const nodesZero = extremes.uniquePoints.map(p => new Node(p.id, p));

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
// setOutsidePointsToEdges :: Polygon -> Points -> undefined
function setOutsidePointsToEdges(poly, points) {
  const reducer = (ps, e) => ps.map(p => e.findOutsidePoints(p)).filter(a => a);
  poly.edges.reduce(reducer, points);
  return undefined;
}

// read input from STDIN
const readline = new ReadlineWrapper().stdin;

// read line and process
readline.on('line', line => {
  // const points = parseJsonPoints(line);
  const points = Parse.pointsJSON(line);

  const polyZero = findPolyZero(points);

  setOutsidePointsToEdges(polyZero, points);

  // const insidePoints = polyZero.edges.reduce((ps, e) => ps.map(p => e.findOutsidePoints(p)).filter(a => a), points);
  // console.log(insidePoints.length);

  // console.log('main:', points.length , outsidePoints.map( as => as.length));
  // console.log('count points outside edge_i', edgesZero.map(e => e.outside.length));

  format.xyTable(console.log)(polyZero.edges.map(e => e.next));
  // console.log(edgesZero[2].outside.map(p => xyTable(p)));
});


// read a single line json formated x-y objects from STDIN
