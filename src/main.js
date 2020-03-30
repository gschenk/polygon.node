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
// Recursively find edges of convex hull based on an edge of P_0
// setOutsidePointsToEdges :: Polygon -> [Point] -> undefined
function setOutsidePointsToEdges(poly, points) {
  const reducer = (ps, e) => ps.map(p => e.findOutsidePoints(p)).filter(a => a);
  poly.edges.reduce(reducer, points);
  return undefined;
}

// pure function
// refineEdge :: {Nodes, Edges} -> Edge -> Point -> Int -> {Nodes, Edges}
function refineEdge(accu, edge, centre, depth) {
  const points = edge.outside;

  // get starting node from accumulator
  const origNode = accu.nodes.slice(-1)[0]

  // get end node from edge, unless it links back to first node
  const endID = edge.nodes[1].id;
  const endNode = endID === accu.nodes[0].id
    ? accu.nodes[0]
    : new Node(endID, edge.nodes[1].point);


  // when there are no outside points
  // the present nodes and edge form final polygon
  // we have to create them anew for proper chaining
  if (points.length === 0) {
    const againEdge = new Edge(
      edgeID(origNode, endNode),
      origNode,
      endNode,
      centre,
    );
    return {
      nodes: accu.nodes.concat([endNode]),
      edges: accu.edges.concat([againEdge]),
      depth: accu.depth.concat([depth]),
    };
  }

  // there is at least one outside point
  // form a new node with the same origin and the next node
  const nextNode = new Node(edge.next.id, edge.next);

  const nextEdge = new Edge(
    edgeID(origNode, nextNode),
    origNode,
    nextNode,
    centre,
  );

  // create temporary edge that links back to P_0
  // this also gets new, temporary nodes
  const testNodeA = new Node(0, nextNode.point);
  const testNodeB = new Node(endNode.id, endNode.point);
  const testEdge = new Edge(0, testNodeA, testNodeB, centre);

  // set outside points to edge
  points.map(p => testEdge.findOutsidePoints(p));

  // otherwise recursion
  // unless we risk stack overrun, no tail call recursion :-(
  if (depth >= MAXRECURSION) {
    console.error('Reached max recursion depth ', depth, ' at edge', testEdge);
    return undefined;
  }
  const recursionAccu = {
    nodes: accu.nodes.concat([nextNode]),
    edges: accu.edges.concat([nextEdge]),
    depth: accu.depth,
  };
  return refineEdge(recursionAccu, testEdge, centre, depth + 1);
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
  const finalNodesEdges = polyZero.edges.reduce((accu, e) => refineEdge(accu, e, polyZero.centre, 0), initAccumulator);

  // create final polygon with nodes and edges from finalNodesEdges
  const finalPoly = new Polygon(1, [...new Set(finalNodesEdges.nodes)]);

  // add edges to poly
  // edges are checked to form a linked chain
  finalNodesEdges.edges.map(e => finalPoly.addEdge(e));
  console.log(finalPoly);


  // console.log(finalNodes)
  format.xyTable(console.log)(
    finalPoly.nodes
  );
  // format.xyTable(console.log)(polyZero.edges.map(e => e.next));
});


// read a single line json formated x-y objects from STDIN
