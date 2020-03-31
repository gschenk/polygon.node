const ReadlineWrapper = require('./readlineWrapper');

const Parse = require('./parse');
const Node = require('./node');
const Edge = require('./edge');
const Polygon = require('./polygon');
const Extremes = require('./extremes');
const {recursiveEdgeChaining} = require('./recursiveEdgeChaining');

const format = require('./format');

// joins ids of nodes into a new one
// edgeID :: {Int}-> {Int} -> Int
const edgeID = (n, m) => Number.parseInt(`${n.id}${m.id}`, 10);

// create edges from ordered set of nodes
// createEdges :: [Node] -> Point -> [Edge]
function createEdges(nodes, centre) {
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
  console.log(extremes);

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
// Recursively find edges of convex hull based on an edge of P_0
// setOutsidePointsToEdges :: Polygon -> [Point] -> undefined
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

  // construct polygon P_0
  const polyZero = findPolyZero(points);

  // find all points outside of edges of P_0
  setOutsidePointsToEdges(polyZero, points);


  // go through all edges of P_0 to find P_f recursively
  const initNode = new Node(
    polyZero.nodes[0].id,
    polyZero.nodes[0].point,
  );
  const initAccumulator = {nodes: [initNode], edges: [], depth: []};
  const finalNodesEdges = polyZero.edges.reduce((accu, e) => recursiveEdgeChaining(accu, e, polyZero.centre, 0), initAccumulator);

  // create final polygon with nodes and edges from finalNodesEdges
  const finalPoly = new Polygon(1, [...new Set(finalNodesEdges.nodes)]);

  // add edges to poly
  // edges are checked to form a linked chain
  finalNodesEdges.edges.map(e => finalPoly.addEdge(e));

  if (finalPoly.isClosed) {
    const area = finalPoly.edges.map(e => e.detCent/2).reduce((sum, x) => sum + x)
    if (area < 0) {
      console.error('Error: Area smaller than zero.', area);
      console.error('Points:');
      format.xyTable(console.error)(
        points,
      );
      console.error('Nodes:');
      format.xyTable(console.error)(
        finalPoly.nodes,
      );
      console.log(0)
    }
    console.log(area)
  } else {
    console.error('Final polygon is not closed! Edges are missing.');
  }


  // console.log(finalNodes)
  // format.xyTable(console.log)(
  //   finalPoly.nodes,
  // );
  // format.xyTable(console.log)(polyZero.edges.map(e => e.next));
});


// read a single line json formated x-y objects from STDIN
