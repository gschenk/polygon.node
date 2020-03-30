const Parse = require('../src/parse');
const Extremes = require('../src/extremes');

const data = require('./examples/16gauss.json');

const jsonString = JSON.stringify(data);
const points = Parse.pointsJSON(jsonString);

const getIds = os => os.map(o => o.id);

describe('test finding extreme points from point cloud', () => {
  test.each([0, 1, 2, 3, 4])('id of found points confirmed (16gauss.json)', i => {
    const ext = new Extremes(points);
    const as = getIds(ext.uniquePoints);
    const bs = [2, 13, 4, 8, 1];
    expect(as[i]).toBe(bs[i]);
  });
});
