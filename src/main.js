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
  const data = JSON.parse(s);
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

  const extremes = new Extremes(points);

  const nodes = extremes.uniquePoints;
  nodes.map(xyTable);
});


// read a single line json formated x-y objects from STDIN
