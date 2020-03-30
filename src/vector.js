// some 2-D vector tools, to be used with arrays

class Vector {
  constructor(...xs) {
    xs.map((x, i) => {
      this[i] = x;
      return null;
    });
  }

  array() { return Object.values(this); }

  normSquare() {
    return this.array()
      .map(x => x ** 2)
      .reduce((sum, x) => sum + x, 0);
  }

  norm() {
    return Math.sqrt(this.normSquare());
  }

  // scalar :: (Numeric a) => a -> Vector
  scalar(a) {
    return new Vector(...this.array().map(x => x * a));
  }

  // sum :: Vector -> Vector -> Vector
  static sum(a, b) {
    const result = a.array().map((x, i) => x + b[i]);
    return new Vector(...result);
  }

  // dot :: Vector -> Vector -> Double
  static dot(a, b) {
    return a.array().map((x, i) => x * b[i]).reduce((sum, x) => sum + x);
  }

  // Determinant of two 2-dim vectors
  // Vector -> Vector -> Double
  static det(a, b) {
    return a[0] * b[1] - b[0] * a[1];
  }

  // fromPoints :: Point -> Point -> [Double]
  static fromPoints(p, q) { return new Vector(q.x - p.x, q.y - p.y); }
}

module.exports = Vector;
