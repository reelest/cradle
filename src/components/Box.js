import Template from "@/components/Template";

export default function Box({ children, boxClass, bg = "white", ...props }) {
  return (
    <Template
      className={`relative shadow-1 rounded-2xl print:shadow-none bg-${bg}`}
      props={props}
    >
      <div className={`rounded-2xl bg-${bg} relative z-10 ${boxClass}`}>
        {children}
      </div>
    </Template>
  );
}
