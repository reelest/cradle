import Box from "@/components/Box";
import Row from "@/components/Row";
import Spacer from "@/components/Spacer";
import Table, {
  TableHeader,
  addClassToColumns,
  addHeaderClass,
} from "@/components/Table";
import { useRegistrationsAPI } from "@/logic/api";
import { useMemo, useState } from "react";
import Events from "./Events";
import TextButton from "@/components/TextButton";
import usePager from "@/utils/usePager";
import Pager from "@/components/Pager";

function MiddleRow() {
  return (
    <Row className="justify-center">
      <Registrations />
      <Events />
    </Row>
  );
}
function Registrations() {
  const [showMore, setShowMore] = useState(false);
  const registrations = useRegistrationsAPI();

  const all = useMemo(() => {
    if (!registrations) return;
    return registrations.students.map(({ name, entranceClass, gender }) => [
      name,
      entranceClass,
      gender,
    ]);
  }, [registrations]);
  const { data, ...controller } = usePager(all || [], 15);
  return (
    <Box
      expand={showMore}
      onClose={() => setShowMore(false)}
      className="flex-grow my-8"
      boxClass="flex flex-col h-full px-6 py-4 2xl:py-6"
    >
      <TableHeader>
        <h2 className="font-36b">Registrations</h2>
      </TableHeader>
      <Table
        loading={!all}
        data={showMore ? data : data.slice(0, 5)}
        rowClass="h-10"
        headers={["Name", "Entrance\xA0Class", "Gender"]}
        renderHooks={[
          addHeaderClass("px-2 first:pl-0 font-20t"),
          addClassToColumns("text-center w-0", [1, 2]),
        ]}
      />
      <Spacer />
      <div className="flex justify-end">
        {showMore ? (
          <Pager controller={controller} />
        ) : (
          <TextButton
            onClick={() => setShowMore(true)}
            color="text-secondary"
            className="text-right  pt-4"
          >
            View all registrations
          </TextButton>
        )}
      </div>
    </Box>
  );
}

export default MiddleRow;
