import { useAdminDashboardAPI } from "@/logic/api";
import sentenceCase from "@/utils/sentenceCase";

import Box from "@/components/Box";
import Row from "@/components/Row";
import {
  default as Table,
  supplyHeader,
  addHeaderClass,
  addClassToColumns,
  supplyValue,
} from "@/components/Table";
import { range } from "d3";
import { formatTime } from "@/utils/formatNumber";
import LoaderAnimation from "@/components/LoaderAnimation";
import { daysToMs } from "@/utils/time_utils";

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
  const startOfDay = new Date(date.getTime());
  startOfDay.setHours(0, 0, 0, 0);
  const currentMonth = sentenceCase(months[date.getMonth()]);
  const currentYear = date.getFullYear();
  return (
    <Box
      className="text-white w-96 mx-8 flex-grow-0 my-8"
      boxClass="h-full px-6 py-4 2xl:py-6 bg-primaryDark max-h-96 overflow-y-auto"
      bg="primaryDark"
    >
      <h2 className="font-32b">Events</h2>
      <h3 className="font-16t text-disabled">Date</h3>
      <Row className="mb-2">
        <h4>
          {currentMonth} {currentYear}
        </h4>
      </Row>
      <WeekView date={date} />
      <ul>
        {events ? (
          events
            .filter((e) => e.date >= startOfDay)
            .filter((e) => e.date <= startOfDay.getTime() + daysToMs(100))
            .sort((a, b) => a.date - b.date)
            .map(({ date, title, scope }, i) => (
              <EventView
                key={i}
                date={date}
                title={title}
                scope={scope}
                isSelected={i == 0}
              />
            ))
        ) : (
          <LoaderAnimation small light />
        )}
      </ul>
    </Box>
  );
}
/**
 * @param {Date} props.date
 * @param {Boolean} props.showHeader
 * @param {Object} props
 */
const WeekView = ({ date }) => {
  const day = date.getDay();
  const firstDay = date.getDate() - day;
  return (
    <Table
      cols={7}
      rows={1}
      headerClass=""
      renderHooks={[
        supplyHeader((col) => sentenceCase(days[col])),
        addHeaderClass("w-24 text-center text-disabled font-16"),
        addClassToColumns("text-center", range(7)),
        supplyValue((row, col) => (
          <span
            className={`inline-block ${
              col === day
                ? "w-8 h-8 inline-flex items-center justify-center rounded-full bg-primaryLight"
                : ""
            }`}
          >
            {firstDay + col}
          </span>
        )),
      ]}
    />
  );
};

const EventView = ({ date, title, scope, isSelected }) => {
  const day = sentenceCase(days[date.getDay()]);
  const monthDate = date.getDate();
  const time = formatTime(date).toLowerCase();
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
      className={`flex rounded px-4 items-center ${
        isSelected ? "bg-accent1 py-1 my-2" : "my-2"
      }`}
    >
      <div
        className={`text-center w-16 flex-shrink-0 mr-4 py-2 rounded-md flex flex-col items-center justify-center ${
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

export default Events;
