const ReadlineWrapper = require('./readlineWrapper');

const Point = require('./point');
const Parse = require('./parse');
const Extremes = require('./extremes');
const {BIGN} = require('./config');
// const Polygon = require('./polygon');


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

// read input from STDIN
const readline = new ReadlineWrapper().stdin;

readline.on('line', line => {
  // const points = parseJsonPoints(line);
  const points = Parse.pointsJSON(line);

  const extremes = new Extremes(points);

  const nodes = extremes.uniquePoints;
  nodes.map(xyTable);
});


// read a single line json formated x-y objects from STDIN
