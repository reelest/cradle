import range from "@/utils/range";
import Template from "./Template";
import ThemedButton from "./ThemedButton";
import mergeProps from "@/utils/mergeProps";
import LoaderAnimation from "./LoaderAnimation";

const borderSpacings = [
  "border-spacing-y-0",
  "border-spacing-y-1",
  "border-spacing-y-2",
  "border-spacing-y-3",
  "border-spacing-y-4",
  "border-spacing-y-5",
];
const renderColumn = ({ data, row, col, classes, attrs, next }) => {
  console.log(attrs);
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
  loading = false,
  headers,
  scrollable,
  headerClass = "border-b text-left",
  bodyClass = "font-20 leading-relaxed",
  rowClass = "",
  rowSpacing = 0,
  onClickRow,
  renderHooks = [],
}) {
  const table = (
    <table
      className={`w-full leading border-separate ${borderSpacings[rowSpacing]}`}
    >
      <thead className={headerClass}>
        <tr>
          {range(cols).map((col) =>
            callHooks(headers, -1, col, [], {}, renderHooks)
          )}
        </tr>
      </thead>
      <tbody className={bodyClass}>
        {loading ? (
          <td colspan={100} className="w-full py-3">
            <LoaderAnimation small />
          </td>
        ) : (
          range(rows).map((row) => (
            <tr
              key={row}
              className={
                typeof rowClass === "function" ? rowClass(row) : rowClass
              }
              onClick={onClickRow ? (e) => onClickRow(e, row) : undefined}
            >
              {range(cols).map((j) =>
                callHooks(data, row, j, [], {}, renderHooks)
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
  if (scrollable)
    return <div className="max-w-full px-1 overflow-x-auto">{table}</div>;
  else return table;
}

export const TableHeader = (props) => (
  <Template props={props} className="flex justify-between mb-4" />
);
export const TableButton = (props) => (
  <Template
    props={props}
    as={ThemedButton}
    variant="redText"
    className="flex items-baseline"
  />
);

/**Default Hooks */
export const addHeaderClass =
  (className) =>
  ({ row, classes, next }) =>
    row < 0 ? next({ classes: classes.concat(className) }) : next();
export const supplyHeader =
  (getHeader) =>
  ({ row, col, next }) =>
    row < 0 ? next({ data: getHeader(col) }) : next();
export const addClassToColumns =
  (className, columns = null) =>
  ({ row, col, classes, next }) =>
    row >= 0 && (!columns || columns.includes(col))
      ? next({ classes: classes.concat(className) })
      : next();
export const onClickHeader =
  (onClick, columns) =>
  ({ row, col, next, attrs }) =>
    row < 0 && (!columns || columns.includes(col))
      ? next({
          attrs: mergeProps(attrs, { onClick: (e) => onClick(e, col) }, [
            "onClick",
          ]),
        })
      : next();
export const supplyValue =
  (getValue) =>
  ({ row, col, next }) =>
    row >= 0 ? next({ data: getValue(row, col) }) : next();
