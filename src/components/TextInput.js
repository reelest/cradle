import Template from "./Template";

export default function TextInput(props) {
  return (
    <Template
      as="input"
      className="px-5 py-5 bg-transparentGray placeholder:text-input-placeholder font-20 rounded-xl w-full focus-visible:outline-primaryLight focus:outline-primaryLight"
      props={props}
    />
  );
}
