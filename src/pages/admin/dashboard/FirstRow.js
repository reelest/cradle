import Box from "@/components/Box";
import PieChart from "@/components/PieChart";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import Image from "next/image";

import students from "../assets/students_32.svg";
import parents from "../assets/parents_32.svg";
import teachers from "../assets/teachers_32.svg";

import { formatNumber } from "@/utils/formatNumber";
import { useAdminDashboardAPI } from "@/logic/api";
import Row from "@/components/Row";
const FirstRow = () => {
  const data = useAdminDashboardAPI();
  return (
    <Row className="justify-center my-8">
      <Box className="flex-grow" boxClass="px-6 py-4 2xl:py-6">
        <div className="flex justify-between align-baseline">
          <h2 className="font-36b">Overview</h2>
          <select disabled={!data} className="select-1">
            {data?.years?.map?.((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="flex bg-white">
          <NumberCell
            img={students}
            number={data?.numStudents}
            label="Students"
            color="black2"
          />
          <NumberCell
            img={teachers}
            number={data?.numTeachers}
            label="Teachers"
            color="primaryLight"
          />
          <NumberCell
            img={parents}
            number={data?.numParents}
            label="Parents"
            color="secondary"
          />
        </div>
      </Box>
      <Box
        className="w-56 mx-8"
        boxClass="flex flex-col py-4 px-6 items-center justify-between h-full"
      >
        <h6 className="font-20b text-center">Incomplete Teacher Profiles</h6>
        <div className="h-24 w-24">
          <PieChart percent={data?.incompleteTeacherProfiles} />
        </div>
        <p className="font-20t text-center">
          {data?.incompleteTeacherProfiles}
        </p>
      </Box>
    </Row>
  );
};
const NumberCell = ({ img, number, label, color }) => {
  return (
    <div className="basis-44 shadow-2 rounded-xl p-3 my-4 mx-2">
      <EllipsisVerticalIcon width={24} className="ml-auto block" />
      <div className="flex justify-center px-2 pt-1 pb-2">
        <Image
          src={img}
          alt={label.toLowerCase()}
          className="inline-block align-middle mx-2"
        />
        <span
          className={`${
            color ? "text-" + color : ""
          } font-32t inline-block align-middle mx-2`}
        >
          {formatNumber(number)}
        </span>
      </div>
      <div className="text-center">Total {label}</div>
    </div>
  );
};

export default FirstRow;
