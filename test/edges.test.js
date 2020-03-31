// tests edges and nodes

const PolyNode = require('../src/polynode');
const Edge = require('../src/edge');

const Point = require('../src/point');

const points = [
  {x: 1, y: 1},
  {x: 2, y: 2},
  {x: 4, y: 1},
  {x: 4, y: -2},
].map((o, i) => new Point(i, o.x, o.y));

const centre = new Point(0, 2.75, 0.5);

describe('test nodes and edges', () => {
  const nodes = points.map(p => new PolyNode(p));
  const edges = [0, 1, 2].map(i => new Edge(nodes[i], nodes[i + 1], centre));

  test('Node gets edges on edge construction', () => {
    expect(nodes[1].edges.length).toBe(2);
  });

  test('Edge.vertical defaults to false', () => {
    expect(edges[1].vertical).toBe(false);
  });

  test('Vertical edge gets flagged', () => {
    expect(edges[2].vertical).toBe(true);
  });

  test('Ever edge has two nodes', () => {
    expect(
      edges.map(o => o.nodes.length).every(x => x === 2),
    ).toBe(true);
  });
});
