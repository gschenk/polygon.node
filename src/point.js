// Point provides x, y coordinates and an id

class Point {
  // Point :: Int -> Double -> Double -> Object
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  json() {
    return JSON.stringify({x: this.point.x, y: this.point.y});
  }
}

module.exports = Point;
