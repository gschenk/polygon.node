const ReadlineWrapper = require('./readlineWrapper');

const Point = require('./point');
const Extremes = require('./extremes');
// const Polygon = require('./polygon');

// constant parameters
const BIGN = 3000;

// sandbox area
// const myPolygon = new Polygon(0, [myPoint]);

// spaces :: Primitive -> String
const spaces = x => ' '.repeat(28 - `${x}`.length);

// xyTable :: Point -> String
const xyTable = point => console.log(`${point.id}   ${point.x}${spaces(point.x)}${point.y}`);



// convexHullArea :: [Point] -> Double
function convexHullArea(nodes) {
  return 0; // stub
}

// parseJsonPoints :: String -> Object
const parseJsonPoints = s => {
  const data = JSON.parse(s)
  // remove duplicates for small sets of data points
  const uniqueData = data.length > BIGN
    ? data
    : [...new Set(data.map(o => JSON.stringify(o)))].map(t => JSON.parse(t));
  return uniqueData.map((a, i) => new Point(i, a.x, a.y));
};

// read input from STDIN
const readline = new ReadlineWrapper().stdin;

readline.on('line', line => {
  const points = parseJsonPoints(line);

  const ext = new Extremes(4);

  const minXs = points.reduce(ext.minXs, ext.initAccu(points[0]));
  const maxXs = points.reduce(ext.maxXs, ext.initAccu(points[0]));
  const minYs = points.reduce(ext.minYs, ext.initAccu(points[0]));
  const maxYs = points.reduce(ext.maxYs, ext.initAccu(points[0]));

  const exDiaXpYn = points.reduce(ext.exDiaXpYn, ext.initAccu(points[0]));
  const exDiaYpXn = points.reduce(ext.exDiaYpXn, ext.initAccu(points[0]));
  const exDiaXpYp = points.reduce(ext.exDiaXpYp, ext.initAccu(points[0]));
  const exDiaXnYn = points.reduce(ext.exDiaXnYn, ext.initAccu(points[0]));

  const nodes = [...new Set([
    minXs[0],
    exDiaXnYn[0],
    minYs[0],
    exDiaXpYn[0],
    maxXs[0],
    exDiaXpYp[0],
    maxYs[0],
    exDiaYpXn[0],
  ]),
  ];
  nodes.map(xyTable);
});


// read a single line json formated x-y objects from STDIN
