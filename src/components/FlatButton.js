import Template from "./Template";

export default function FlatButton(props) {
  return (
    <Template
      as="button"
      className="text-style-1 text-placeholder p-5 hover:text-primaryLight active:text-primary"
      props={props}
    />
  );
}
