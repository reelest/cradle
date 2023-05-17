import Box from "@/components/Box";
import LoaderAnimation from "@/components/LoaderAnimation";
import Row from "@/components/Row";
import Spacer from "@/components/Spacer";
import Table from "@/components/Table";
import { useAdminDashboardAPI, useRegistrationsAPI } from "@/logic/api";
import sentenceCase from "@/utils/sentenceCase";
import { useMemo, useState } from "react";

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
    <Box className="flex-grow" boxClass="flex flex-col h-full px-6 py-4">
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
      <Spacer />
      <div className="text-right text-secondary">View all registrations</div>
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
  const events = useAdminDashboardAPI()?.events;
  const currentMonth = sentenceCase(months[date.getMonth()]);
  const currentYear = date.getFullYear();
  return (
    <Box
      className="text-white w-96 mx-8 flex-grow-0"
      boxClass="h-full px-6 py-4 bg-primaryDark"
      bg="primaryDark"
    >
      <h2 className="font-32b">Events</h2>
      <h3 className="font-16t text-disabled">Date</h3>
      <Row className="mb-2">
        <h4>
          {currentMonth} {currentYear}
        </h4>
      </Row>
      <WeekView showHeader date={date} />
      <ul>
        {events?.map?.(({ date, title, scope }, i) => (
          <EventView
            key={i}
            date={date}
            title={title}
            scope={scope}
            isSelected={i == 0}
          />
        ))}
      </ul>
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
  const firstDay = date.getDate() - day;
  return (
    <Table
      cols={7}
      className="w-full"
      rows={1}
      headerClass=""
      renderHooks={[
        ({ col, row, classes, next }) => {
          return row < 0
            ? next({
                data: sentenceCase(days[col]),
                classes: [
                  "w-1/7 text-center text-disabled font-16",
                  ...classes,
                ],
              })
            : next({
                data: (
                  <span
                    className={`inline-block ${
                      col === day
                        ? "w-8 h-8 inline-flex items-center justify-center rounded-full bg-primaryLight"
                        : ""
                    }`}
                  >
                    {firstDay + col}
                  </span>
                ),
                classes: classes.concat("text-center"),
              });
        },
      ]}
    />
  );
};

const EventView = ({ date, title, scope, isSelected }) => {
  const day = sentenceCase(days[date.getDay()]);
  const monthDate = date.getDate();
  const time = `${date.getHours() % 12}:${date.getMinutes()}${
    date.getHours() >= 12 ? "pm" : "am"
  }`;
  const toScopeString = (scope) => {
    let mask = Object.keys(scope).filter((e) => scope[e]);
    return mask.length === 0
      ? ""
      : "All " +
          (mask.length === 1
            ? mask[0]
            : mask.slice(0, -1).join(", ") + " and " + mask[mask.length - 1]);
  };
  return (
    <div
      className={`flex rounded pl-3 pr-1 items-center ${
        isSelected ? "bg-accent1 py-1 my-2" : "my-2"
      }`}
    >
      <div
        className={`text-center w-16 flex-shrink-0 mx-2 py-2 rounded-md flex flex-col items-center justify-center ${
          isSelected ? "bg-transparent" : "bg-primaryLight"
        }`}
      >
        <p className="font-10 text-primaryDark">{day}</p>
        <p className="font-32b leading-none">{monthDate}</p>
      </div>
      <div className="w-0 flex-grow">
        <h4 className="font-20t text-white leading-normal w-auto overflow-hidden whitespace-nowrap text-ellipsis">
          {title}
        </h4>
        <p
          className={`font-12 ${
            isSelected ? "text-primaryDark" : "text-disabled"
          }`}
        >
          {toScopeString(scope)}
        </p>
        <p>
          <span
            className={`rounded p-0.5 ${
              isSelected ? "bg-white text-primaryDark" : "bg-primaryLight"
            }`}
          >
            {time}
          </span>
        </p>
      </div>
    </div>
  );
};
export default MiddleRow;
