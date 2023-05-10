import { useMemo, useState } from "react";

export default function useFormHandler(defaults = {}, cb) {
  const [data, setData] = useState(defaults);
  return useMemo(() => new FormHandler(data, setData, cb), [data, cb]);
}

class FormHandler {
  constructor(data, setData, cb) {
    this.data = data;
    this.setData = setData;
    this.cb = cb;
    console.log("new form data");
  }
  _update(data = {}) {
    this.data = { ...this.data, ...data };
    this.setData(this.data);
  }
  textInput(id, type) {
    return {
      id,
      name: id,
      type,
      onChange: (e) => {
        this.data[id] = e.target.value;
        this._update();
      },
      value: this.data[id],
    };
  }
  radio(id) {
    return this.textInput(...args, "radio");
  }
  checkbox(id) {
    return {
      id,
      name: id,
      type: "checkbox",
      onChange: (e) => {
        this.data[id] = e.target.checked;
        this._update();
      },
      value: this.data[id],
    };
  }
  form(id) {
    return {
      id,
      name: id,
      onSubmit: (e) => {
        e.preventDefault();
        this.cb(new FormData(e.target), e.target);
        return false;
      },
    };
  }
  submit(id) {
    return {
      id,
      name: id,
      type: "submit",
      onClick: (e) => {
        this.data[id] = true;
        this._update();
      },
    };
  }
}
