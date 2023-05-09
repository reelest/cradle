import { createElement } from "react";

export default function Template({
  as,
  children,
  className = "",
  style = {},
  props: {
    className: className2 = "",
    style: styles2 = {},
    children: children2,
    as: as2,
    ...props
  } = {},
}) {
  return createElement(
    as2 || as,
    {
      style: { ...style, ...styles2 },
      className: `${className} ${className2}`,
      ...props,
    },
    children && children2 ? [...children, ...children2] : children || children2
  );
}
