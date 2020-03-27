const ReadlineWrapper = require('./readlineWrapper');

const Point = require('./point');
// const Polygon = require('./polygon');

// sandbox area
// const myPolygon = new Polygon(0, [myPoint]);


// convexHullArea :: [Point] -> Double
function convexHullArea(points) {
  return 0; // stub
}

// spaces :: Primitive -> String
const spaces = x => ' '.repeat(22 - `${x}`.length);

// xyTable :: Point -> String
const xyTable = point => console.log(`${point.x}${spaces(point.x)}${point.y}`);

// parseJsonPoints :: String -> Object
const parseJsonPoints = s => JSON.parse(s)
  .map((a, i) => new Point(i, a.x, a.y));


// read input from STDIN
const readline = new ReadlineWrapper().stdin;

readline.on('line', line => {
  const points = parseJsonPoints(line);
  points.map(xyTable);
  // console.log(points);
});


// read a single line json formated x-y objects from STDIN
