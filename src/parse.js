// parsing JSON input, and filtering duplicates from small
// input sets

const Point = require('./point');
const {BIGN} = require('./config');

class Parse {
  // pointsJSON :: String -> Object
  static pointsJSON(line) {
    const data = JSON.parse(line);

    // remove duplicates for small sets of data points
    const uniqueData = data.length > BIGN
      ? data
      : [...new Set(data.map(o => JSON.stringify(o)))].map(t => JSON.parse(t));

    // id for data points starts at 1, id = 0 reserved
    return uniqueData.map((a, i) => new Point(i + 1, a.x, a.y));
  }
}


module.exports = Parse;
