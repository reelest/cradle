import Box from "@/components/Box";
import LoaderAnimation from "@/components/LoaderAnimation";
import Row from "@/components/Row";
import Spacer from "@/components/Spacer";
import Table, {
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  supplyHeader,
  supplyValue,
} from "@/components/Table";
import { useAdminDashboardAPI, useRegistrationsAPI } from "@/logic/api";
import { formatTime } from "@/utils/formatNumber";
import range from "@/utils/range";
import sentenceCase from "@/utils/sentenceCase";
import { useMemo, useState } from "react";
import Events from "./Events";

function MiddleRow() {
  return (
    <Row className="my-8">
      <Registrations />
      <Events />
    </Row>
  );
}
function Registrations() {
  const [showMore, setShowMore] = useState(false);
  const registrations = useRegistrationsAPI();

  const data = useMemo(() => {
    if (!registrations) return;
    return registrations.students.map(({ name, entranceClass, gender }) => [
      name,
      entranceClass,
      gender,
    ]);
  }, [registrations]);
  return (
    <Box
      className="flex-grow"
      boxClass="flex flex-col h-full px-6 py-4 2xl:py-6"
    >
      <TableHeader>
        <h2 className="font-36b">Registrations</h2>
      </TableHeader>
      <Table
        loading={!data}
        data={showMore || !data ? data : data.slice(0, 5)}
        rowClass="h-10"
        headers={["Name", "Entrance\xA0Class", "Gender"]}
        renderHooks={[
          addHeaderClass("px-2 first:pl-0 font-20t"),
          addClassToColumns("text-center w-0", [1, 2]),
        ]}
      />
      <Spacer />
      <div className="text-right text-secondary pt-4">
        View all registrations
      </div>
    </Box>
  );
}

export default MiddleRow;
