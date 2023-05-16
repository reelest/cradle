import Template from "@/components/Template";

export default function Box({ children, boxClass, bg = "white", ...props }) {
  return (
    <Template className={`relative shadow-1 rounded-lg bg-${bg}`} props={props}>
      <div className={`rounded-lg bg-${bg} relative z-10 ${boxClass}`}>
        {children}
      </div>
    </Template>
  );
}
