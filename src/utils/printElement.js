import styles from "./print_element.module.css";

const get = (e) => document.getElementsByClassName(e);
const keep = (elem) => {
  while (elem) {
    elem.classList.add(styles["print-parent"]);
    elem = elem.parentElement;
  }
};
export default function printElement(elem) {
  try {
    elem.classList.add(styles["print-target"]);
    keep(elem);
    const els = get(styles["print-preserve"]);
    for (let i = els.length - 1; i >= 0; i--) {
      keep(els.item(i));
    }
    document.documentElement.classList.add(styles["printing"]);
    window.print();
  } finally {
    let els = get(styles["print-target"]);
    for (let i = els.length - 1; i >= 0; i--) {
      els.item(i).classList.remove(styles["print-target"]);
    }
    els = get(styles["print-parent"]);
    for (let i = els.length - 1; i >= 0; i--) {
      els.item(i).classList.remove(styles["print-parent"]);
    }
    document.documentElement.classList.remove(styles["printing"]);
  }
}
