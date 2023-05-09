import Template from "./Template";

export default function TextInput(props) {
  return (
    <Template
      as="input"
      className="px-5 py-5 bg-transparentGray placeholder:text-input-placeholder text-style-1 rounded-xl w-full focus-visible:outline-primary focus:outline-primary"
      props={props}
    />
  );
}
