// formating output
//
// spaces :: Primitive -> String
const spaced = n => x => {
  const negSpace = x < 0
    ? ''
    : ' ';
  const trailingSpace = n > 0
    ? ' '.repeat(n - `${negSpace}${x}`.length)
    : '';
  return `${negSpace}${x}${trailingSpace}`;
};

// format points in a neat table
// xyTableLine :: Point -> String
const xyTableLine = point => {
  const {id} = point;
  const x = point.x.toExponential();
  const y = point.y.toExponential();

  return `${spaced(8)(id)}   ${spaced(22)(x)}   ${spaced(0)(y)}`;
};

// xyTable expects function with side effects, such as console.log
const xyTable = fun => points => points
  .forEach(p => fun(xyTableLine(p)));

module.exports = {xyTable};
