// Polygon stores linking information to nodes and points.
// A polygon has to be constructed with all nodes it ought to contain.
// Edges are added subsequently and checked for linking to nodes.
const Point = require('./point');

// find coordinates of geometric centre of poly
// centre :: [Node] => Point
const centre = nodes => {
  const h = nodes.length;
  const x = nodes.reduce((sum, n) => sum + n.x, 0) / h;
  const y = nodes.reduce((sum, n) => sum + n.y, 0) / h;
  return new Point(0, x, y);
};

class Polygon {
  // Polygon :: Int -> [Node]-> { Int, [Node], Point }
  constructor(id, nodes) {
    this.id = id;
    this.nodes = nodes;
    this.edges = [];
    this.isClosed = false;

    const noNodes = this.nodes.length === 0;
    this.centre = noNodes ? new Point(0, 0, 0) : centre(this.nodes);
  }

  // Warning: Side-effects!
  addEdge(edge) {
    const nEdges = this.edges.length;

    // checking conditions
    // both nodes must be present
    const hasThisNodes = edge.nodes
      .map(n => this.nodes.includes(n))
      .every(a => a);

    // adding first edge?
    const firstEdge = nEdges === 0;

    // ensure continuous linking of edges
    const previousNode = firstEdge
      ? this.nodes[0]
      : this.edges[nEdges - 1].nodes[1];
    const isLinked = previousNode === edge.nodes[0];


    if (!hasThisNodes) {
      console.error(
        `Error: Polygon ${this.id} does not have both nodes of edge ${edge.id}`,
      );
      console.error(this, edge);
    } else if (!isLinked) {
      console.error(
        `Error: Edge ${edge.id} in polygon ${this.id}`,
        'does not link to previous edge or first node.',
      );
      console.error(this, edge);
    } else {
      // all conditions met, adds edge
      this.edges = [...this.edges, edge];

      // check if edge closes polygon
      if (edge.nodes[1] === this.nodes[0]) { this.isClosed = true; }
    }
  }
}

module.exports = Polygon;
