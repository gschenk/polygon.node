const ReadlineWrapper = require('./readlineWrapper');

const Parse = require('./parse');
// const Point = require('./point');
const Node = require('./node');
const Edge = require('./edge');
const Polygon = require('./polygon');
const Extremes = require('./extremes');
const {MAXRECURSION} = require('./config');

const format = require('./format');
// const Polygon = require('./polygon');

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
// setOutsidePointsToEdges :: Polygon -> [Point] -> undefined
function setOutsidePointsToEdges(poly, points) {
  const reducer = (ps, e) => ps.map(p => e.findOutsidePoints(p)).filter(a => a);
  poly.edges.reduce(reducer, points);
  return undefined;
}

// pure function
// refineEdge :: Edge -> Point -> Int -> {Nodes, Edges}
function refineEdge(edge, centre, depth) {
  const points = edge.outside;

  // when there are no outside points
  // the present nodes and edge form final polygon
  if (points.length === 0) return {nodes: edge.nodes, edges: [edge], depth};

  // there is at least one outside point
  // form a new node with the same origin and the next node
  const origNode = new Node(edge.origin.id, edge.origin);
  const nextNode = new Node(edge.next.id, edge.next);

  const nextEdge = new Edge(
    edgeID(origNode, nextNode),
    origNode,
    nextNode,
    centre,
  );

  // create temporary edge that links back to P_0
  const testHead = new Node(edge.nodes[1].id, edge.nodes[1].point);

  const testEdge = new Edge(
    edgeID(nextNode, testHead),
    nextNode,
    testHead,
    centre,
  );

  // set outside points to edge
  points.map(p => testEdge.findOutsidePoints(p));

  // if there are no points outside that edge, finish here
  if (testEdge.maxAngle === 0) {
    return {
      nodes: [...nextEdge.nodes, testEdge.nodes[1]],
      edges: [nextEdge, testEdge],
      depth,
    };
  }

  // otherwise recursion
  // unless we risk stack overrun, no tail call recursion :-(
  if (depth >= MAXRECURSION) {
    console.error('Reached max recursion depth ', depth, ' at edge', testEdge);
    return undefined;
  }
  const result = refineEdge(testEdge, centre, depth + 1);
  return {
    nodes: nextEdge.nodes.concat(result.nodes),
    edges: [nextEdge].concat(result.edges),
    depth: result.depth,
  };
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

  const finalNodesEdges = polyZero.edges.map(e => refineEdge(e, polyZero.centre, 0));
  console.log('recursion depth:', finalNodesEdges.flatMap(o => o.depth));

  const finalNodes = finalNodesEdges.flatMap(o => o.nodes);

  // console.log(finalNodes)
  format.xyTable(console.log)(
    finalNodes,
  );
  // format.xyTable(console.log)(polyZero.edges.map(e => e.next));
});


// read a single line json formated x-y objects from STDIN
