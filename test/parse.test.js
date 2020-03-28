const Parse = require('../src/parse');

const jsonString = '[{"x":15.189211764297738,"y":35.517951684168324},{"x":4.282306890290215,"y":55.81534305182416},{"x":4.282306890290215,"y":55.81534305182416},{"x":4.282306890290215,"y":55.81534305182416},{"x":23.05894085383961,"y":58.07214228538815},{"x":-18.435907239908637,"y":50.836143457276094},{"x":4.282306890290215,"y":55.81534305182416},{"x":-6.90643570695876,"y":36.84103857636174},{"x":17.402832320924915,"y":49.06039493910567},{"x":1.7429761857955803,"y":24.277360370052104},{"x":11.496786268496193,"y":25.85321407474797}]';

describe('test parsing json files', () => {
  test('duplicates are removed', () => {
    expect(Parse.pointsJSON(jsonString).length).toBe(8);
  });
  const result = Parse.pointsJSON(jsonString).slice(-1)[0];
  test('x, y value of last point correct', () => {
    expect(result.x).toBe(11.496786268496193);
  });
  test('x, y value of last point correct', () => {
    expect(result.y).toBe(25.85321407474797);
  });
});
