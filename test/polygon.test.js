// tests edges and nodes

const Node = require('../src/polynode');
const Edge = require('../src/edge');
const Polygon = require('../src/polygon');

const Point = require('../src/point');

const points = [
  {x: 1, y: 1},
  {x: 3, y: 1},
  {x: 2, y: 4},
].map((o, i) => new Point(i + 1, o.x, o.y));

const morePoints = [
  {x: 1.5, y: 3},
  {x: 2.1, y: 0.5},
  {x: 1.5, y: 1.5},
  {x: 2.5, y: 2.5},
  {x: 0, y: 1},
  {x: 3.1, y: 1},
  {x: 1.4, y: 2},
].map((o, i) => new Point(i + 4, o.x, o.y));

const centre = new Point(0, 2, 2);
const nodes = points.map((p, i) => new Node(i, p));

const edges = [0, 1].map(i => new Edge(i, nodes[i], nodes[i + 1], centre));
const closingEdge = new Edge(2, nodes[2], nodes[0], centre);

describe('test polygons', () => {
  const poly = new Polygon(0, nodes);

  test('Polygon is constructed with all nodes', () => {
    expect(
      poly.nodes.map(n => nodes.includes(n)).every(a => a),
    ).toBe(true);
  });


  test.each(['x', 'y'])('Polygon centre %s coordinate is correct', k => {
    expect(poly.centre[k]).toBe(centre[k]);
  });

  test('Two edges added to polygon', () => {
    edges.map(e => poly.addEdge(e));
    expect(poly.edges.map(e => edges.includes(e)).every(a => a)).toBe(true);
  });

  test('Final edge added to polygon completes it', () => {
    poly.addEdge(closingEdge);
    expect(poly.isClosed).toBe(true);
  });


  test('Points in- and outside of poly identify correctly', () => {
    const insidePoints = poly.edges
      .reduce((ps, e) => ps
        .map(p => e.findOutsidePoints(p))
        .filter(a => a), [...points, ...morePoints]);
    const outsidePoints = poly.edges.flatMap(e => e.outside);
    expect(insidePoints.map(p => p.id).join(', ')).toBe('6, 10');
    expect(outsidePoints.map(p => p.id).join(', ')).toBe('5, 4');
  });
});
