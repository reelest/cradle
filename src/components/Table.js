import range from "@/utils/range";

const renderColumn = ({ data, row, col, classes, attrs, next }) => {
  return row >= 0 ? (
    <td key={row + ";" + col} className={classes.join(" ")} {...attrs}>
      {Array.isArray(data) ? data[row][col] : data}
    </td>
  ) : (
    <th key={col} className={classes.join(" ")} {...attrs}>
      {Array.isArray(data) ? data[col] : data}
    </th>
  );
};

const callHooks = (
  _data,
  _row,
  _col,
  _classes,
  _attrs,
  [firstHook, ...renderHooks]
) => {
  return (firstHook || renderColumn)({
    data: _data,
    row: _row,
    col: _col,
    classes: _classes,
    attrs: _attrs,
    next: ({
      data = _data,
      row = _row,
      col = _col,
      classes = _classes,
      attrs = _attrs,
    } = {}) => callHooks(data, row, col, classes, attrs, renderHooks),
  });
};
export default function Table({
  data,
  rows = Array.isArray(data) ? data.length : 0,
  cols = Array.isArray(data?.[0]) ? data[0].length : 0,
  headers,
  headerClass = "border-b font-20t text-left",
  renderHooks = [],
  variant = "variant-0",
}) {
  return (
    <table className="w-full">
      <thead className={headerClass}>
        {range(cols).map((j) => callHooks(headers, -1, j, [], {}, renderHooks))}
      </thead>
      <tbody className="font-20">
        {range(rows).map((i) => (
          <tr key={i}>
            {range(cols).map((j) => callHooks(data, i, j, [], {}, renderHooks))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
