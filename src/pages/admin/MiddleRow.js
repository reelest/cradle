import Box from "@/components/Box";
import LoaderAnimation from "@/components/LoaderAnimation";
import Row from "@/components/Row";
import Table from "@/components/Table";
import { useRegistrationsAPI } from "@/logic/api";
import sentenceCase from "@/utils/sentenceCase";
import { useMemo, useState } from "react";

function MiddleRow() {
  return (
    <Row>
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
    <Box className="flex-grow" boxClass="p-6">
      <h2 className="font-36b">Registrations</h2>
      {data ? (
        <Table
          data={showMore ? data : data.slice(0, 5)}
          headers={["Name", "Entrance\xA0Class", "Gender"]}
          renderHooks={[
            ({ col, row, classes, next }) =>
              col !== 0 && row > -1
                ? next({ classes: classes.concat("text-center", "w-0") })
                : next({ classes: classes.concat("px-2") }),
          ]}
        />
      ) : (
        <LoaderAnimation className="w-10 block mx-auto my-4" />
      )}
    </Box>
  );
}

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
function Events({ date = new Date() }) {
  const currentMonth = sentenceCase(months[date.getMonth()]);
  const currentYear = date.getFullYear();
  return (
    <Box
      className="text-white basis-96"
      boxClass="h-full p-6 bg-primaryDark"
      bg
    >
      <h2 className="font-32b">Events</h2>
      <h3 className="font-16t text-disabled">Date</h3>
      <Row>
        <h4>
          {currentMonth} {currentYear}
        </h4>
      </Row>
      <WeekView showHeader date={date} />
    </Box>
  );
}
/**
 * @param {Date} props.date
 * @param {Boolean} props.showHeader
 * @param {Object} props
 */
const WeekView = ({ dat, showHeader }) => {
  const date = new Date();
  const day = date.getDay();
  const first = date.get;
  return (
    <Table
      cols={7}
      className="w-full"
      rows={1}
      renderHooks={[
        ({ col, row, next }) => {
          return row < 0 ? next({ data: sentenceCase(days[col]) }) : next();
        },
      ]}
    />
  );
};
export default MiddleRow;
