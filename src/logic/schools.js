import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";

const [useSelectedSchool, , setSchool] = createSubscription(noop);
setSchool("high school");
/**
 * @typedef {("high school"|"montessori")} SchoolType
 */
/**
 *
 * @returns {[SchoolType, (SchoolType)=>void]}
 */
export default function useSchool() {
  return [useSelectedSchool(), setSchool];
}

export const SchoolInfo = {
  "high school": {
    name: "High School",
  },
  montessori: {
    name: "Montessori",
  },
};
