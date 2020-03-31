// This function is applied to every edge of a polygon in sequence.
// It will find the nodes of the complex hull polygon.
// It will also create new nodes and edges and links them.
// The return value is an accumulator object with lists of
// nodes and edges.
// To be used with Array.prototype.reduce()

const PolyNode = require('./polynode');
const Edge = require('./edge');
const {MAXRECURSION} = require('./config');

// joins ids of nodes into a new one
// edgeID :: {Int}-> {Int} -> Int
const edgeID = (n, m) => Number.parseInt(`${n.id}${m.id}`, 10);

// pure function
// Recursively find edges of convex hull based on an edge of P_0
// refineEdge :: {PolyNodes, Edges} -> Edge -> Point -> Int -> {PolyNodes, Edges}
function recursiveEdgeChaining(accu, edge, centre, depth) {
  const points = edge.outside;

  // get starting node from accumulator
  const origNode = accu.nodes.slice(-1)[0];

  // get end node from edge, unless it links back to first node
  const endID = edge.nodes[1].id;
  const endNode = endID === accu.nodes[0].id
    ? accu.nodes[0]
    : new PolyNode(endID, edge.nodes[1].point);


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
  const nextNode = new PolyNode(edge.next.id, edge.next);

  const nextEdge = new Edge(
    edgeID(origNode, nextNode),
    origNode,
    nextNode,
    centre,
  );

  // create temporary edge that links back to P_0
  // this also gets new, temporary nodes
  const testNodeA = new PolyNode(0, nextNode.point);
  const testNodeB = new PolyNode(endNode.id, endNode.point);
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
  return recursiveEdgeChaining(recursionAccu, testEdge, centre, depth + 1);
}

module.exports = {recursiveEdgeChaining};
