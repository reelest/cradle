import Template from "./Template";

const variants = {
  large:
    "px-10 py-5 bg-primary rounded-xl text-style-2 active:bg-primaryDark hover:outline outline-accent1",
  small:
    "px-6 py-1 bg-primaryLight rounded-lg text-style-2 active:bg-primary hover:outline outline-accent1",
};
export default function RaisedButton({ variant = "large", ...props }) {
  return (
    <Template
      as="button"
      className={`${variants[variant]} text-white`}
      props={props}
    />
  );
}
