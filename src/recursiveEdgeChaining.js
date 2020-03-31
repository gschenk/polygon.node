// This function is applied to every edge of a polygon in sequence.
// It will find the nodes of the complex hull polygon.
// It will also create new nodes and edges and links them.
// The return value is an accumulator object with lists of
// nodes and edges.
// To be used with Array.prototype.reduce()

const PolyNode = require('./polynode');
const Edge = require('./edge');
const {MAXRECURSION} = require('./config');

// pure function
// Recursively find edges of convex hull based on an edge of P_0
// refineEdge :: {[PolyNode], [Edge]} -> Edge -> Point -> Int -> {[PolyNode], [Edge]}
function recursiveEdgeChaining(accu, edge, centre, depth) {
  const points = edge.outside;

  // get starting node from accumulator
  const origNode = accu.nodes.slice(-1)[0];

  // get end node from edge, unless it links back to first node
  const endID = edge.nodes[1].id;
  const endNode = endID === accu.nodes[0].id
    ? accu.nodes[0]
    : new PolyNode(edge.nodes[1].point, endID);


  // when there are no outside points
  // the present nodes and edge form final polygon
  // we have to create them anew for proper chaining
  if (points.length === 0) {
    const againEdge = new Edge(
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
  const nextNode = new PolyNode(edge.next);

  const nextEdge = new Edge(
    origNode,
    nextNode,
    centre,
  );

  // create temporary edge that links back to P_0
  // this also gets new, temporary nodes
  const testNodeA = new PolyNode(nextNode.point, 0);
  const testNodeB = new PolyNode(endNode.point);
  const testEdge = new Edge(testNodeA, testNodeB, centre, 0);

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
  return recursiveEdgeChaining(recursionAccu, testEdge, centre, depth + 1);
}

module.exports = {recursiveEdgeChaining};
