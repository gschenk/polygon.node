// Edge provides an object to store geometric properties and linking
// information for edges. It also holds a method to identify if a point
// is inside or outside of the edge. The inside is defined by the vector
// of the base point of the edge to the centre of the polygon.

const Vector = require('./vector');

// equalFloats :: Number -> Number -> Bool
const equalFloats = (a, b) => Math.abs(a - b) < 2 * Number.EPSILON;


// calculates the determinant of the edge vector with
// a vector from its first node to a point
// detWithPoint :: Vector => PolyNode => Point => Double
const detWithPoint = (v, n) => p => Vector.det(v, Vector.fromPoints(n, p));

class Edge {
  constructor(id, nodeA, nodeB, centre) {
    this.id = id;
    this.nodes = [nodeA, nodeB];

    // link edge in nodes
    nodeA.addEdge(this);
    nodeB.addEdge(this);

    // geometric properties of edge
    this.vertical = equalFloats(nodeA.x, nodeB.x);
    this.horizontal = equalFloats(nodeA.y, nodeB.y);

    // Assume reference frame with first node at origin
    this.origin = nodeA.point;

    // edge vector = position vector of second node
    this.vector = this.positionVector(nodeB);

    this.squaredLength = this.vector.normSquare();

    // detWithPoint :: Point -> Double
    this.detWithPoint = detWithPoint(this.vector, nodeA);

    // determinant with position vector of centre,
    // twice the area of triangle nodeA, nodeB, centre
    const detCent = Vector.det(this.vector, this.positionVector(centre));
    this.detCent = equalFloats(detCent, 0)
      ? 0
      : detCent;

    this.insideIsNegative = this.detCent < 0;

    // list of points
    this.outside = [];

    // next node
    this.next = nodeB.point;

    // largest angle (not really an angle)
    this.maxAngle = 0;
  }

  // positionVector :: Point -> Vector
  positionVector(point) { return Vector.fromPoints(this.origin, point); }

  // Warning: Side Effects!
  // Warning: Mutates Edge
  findOutsidePoints(point) {
    const sign = this.insideIsNegative ? -1 : 1;
    const position = this.positionVector(point);
    const det = sign * Vector.det(this.vector, position);

    // collinear: forget when on edge
    if (equalFloats(det, 0)) return null;

    // inside point or collinear
    if (det > 0) return point;

    // otherwise outside point
    this.outside.push(point);

    const foo = det ** 2 / position.normSquare();
    if (foo > this.maxAngle) {
      this.maxAngle = foo;
      this.next = point;
    }

    return null;
  }
}

module.exports = Edge;
