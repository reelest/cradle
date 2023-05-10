import { None } from "@/utils/none";
import Template from "./Template";

const variants = {
  large:
    "px-10 py-5 bg-primary rounded-2xl font-24b active:bg-primaryDark hover:outline outline-accent1 text-white",
  text: "font-20 text-placeholder p-5 hover:text-primaryLight active:text-primary",
  small:
    "px-6 py-1 bg-primaryLight rounded-lg font-24b active:bg-primary hover:outline outline-accent1 text-white",
};

const mergeableEvents = ["onClick"];
export default function RaisedButton({
  variant = "large",
  caret = false,
  children,
  value,
  noSubmit,
  ...props
}) {
  return (
    <Template
      as="button"
      className={variants[variant]}
      mergeableEvents={mergeableEvents}
      value={caret && !children && value ? value + "\xa0\xa0>" : value}
      {...(noSubmit ? { onClick: preventDefault } : None)}
      props={{
        children: caret && children ? children.concat(["\xa0\xa0>"]) : children,
        ...props,
      }}
    />
  );
}

const preventDefault = (e) => e.preventDefault();
