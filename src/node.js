class Node {
  constructor(id, point) {
    this.id = id;
    this.point = point;
    this.x = point.x;
    this.y = point.y;
    this.edges = [];
    this.complete = false;
  }

  // method has side effects!
  addEdge(edge) {
    if (this.complete) {
      console.error('Error: More than two edges in', this);
    } else if (this.edges.length === 0) {
      this.edges = [edge];
    } else {
      this.edges = [...this.edges, edge];
      this.complete = true;
    }
  }
}

module.exports = Node;
