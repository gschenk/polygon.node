// Point provides x, y coordinates and an id

class Point {
  // Point :: Int -> Double -> Double -> Object
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  // coincidence :: Point -> Bool
  coincidence(other) {
    console.log(this, other);
    return this.x === other.x && this.y === other.y;
  }
}

module.exports = Point;
