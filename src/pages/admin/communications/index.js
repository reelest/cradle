import { useEffect, useMemo, useRef, useState } from "react";
import { ProfilePic, SearchInput } from "../dashboard/TopRow";
import ThemedButton from "@/components/ThemedButton";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import Table, {
  TableButton,
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  clipColumn,
  pageData,
  supplyValue,
  useColumnSelect,
} from "@/components/Table";
import {
  useAdministratorsAPI,
  useClassesAPI,
  useCoursesAPI,
  useParentsAPI,
  usePaymentsAPI,
  useStudentsAPI,
  useTeachersAPI,
} from "@/logic/api";
import { formatDate, formatNumber, formatTime } from "@/utils/formatNumber";
import useScrollAnchor from "@/utils/useScrollAnchor";
import ThemedTable from "@/components/ThemedTable";
import Box from "@/components/Box";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import usePager from "@/utils/usePager";
import uniq from "@/utils/uniq";
import Pager from "@/components/Pager";
import useArrayState from "@/utils/useArrayState";
import Spacer from "@/components/Spacer";
import printElement from "@/utils/printElement";
import Printed from "@/components/Printed";
import AppLogo from "@/components/AppLogo";
import delay from "@/utils/delay";

export default function CommunicationsView() {
  const [active, setActive] = useState("courses");
  const [schoolType, setSchoolType] = useState("high school");
  const tabs = ["Announcements", "Events"];
  const [currentClass, selectClass] = useArrayState(tabs);
  const payments = usePaymentsAPI(currentClass)?.payments;

  const branches = useMemo(
    () =>
      payments &&
      payments
        .map((e) => e.branch)
        .sort()
        .filter(uniq),
    [payments]
  );

  const [sort, setSort] = useState("latest");
  const filtered = useMemo(
    () =>
      payments &&
      payments
        .slice()
        .sort((a, b) =>
          sort === "latest"
            ? a.date - b.date
            : sort == "name"
            ? a.name.localeCompare(b.name)
            : a.amount - b.amount
        ),
    [payments, sort]
  );

  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <div class="flex border-b border-transparentGray py-8 mb-8 justify-end">
        <h1 className="font-36b">Communication</h1>
        <Spacer />
        <select
          className="select-1"
          value={schoolType}
          onChange={(e) => setSchoolType(e.target.value)}
        >
          <option value="high school">High School</option>
          <option value="montessori">Montessori</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Create an announcement</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>

      <div className="h-10" />
      <TabbedList
        currentTab={currentClass}
        onSelectTab={selectClass}
        tabHeaders={tabs}
        printHeader={
          <>
            <AppLogo />
            <h1>Courses</h1>
          </>
        }
        headerContent={
          <>
            {/* Use span because of justify-between */}
            <span />
            <select
              className="select-1"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="latest">Latest Payments</option>
              <option value="name">Alphabetical Order</option>
              <option value="amount">Lowest to Highest</option>
            </select>
          </>
        }
        results={filtered}
        renderItem={(item, i) => (
          <div className="rounded-lg shadow-3 m-4 py-5 px-5">
            <div className="flex justify-between">
              <h6 className="font-24b">Upcoming Event - Cradle</h6>
              <p>Posted on May 15, 2023</p>
            </div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Repudiandae, in aliquam? Architecto mollitia officia illo vero
              velit repellendus suscipit accusamus similique. Consequatur nihil
              maxime temporibus praesentium ullam aut numquam mollitia?Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Neque ipsa iure
              animi error laboriosam eaque distinctio possimus tempora hic ipsum
              deleniti blanditiis, labore sequi culpa nemo iste reprehenderit
              quae praesentium?
            </p>
          </div>
        )}
      />
    </div>
  );
}

function TabbedList({
  results,
  tabHeaders,
  onSelectTab,
  currentTab,
  headerContent,
  printHeader,
  renderItem,
}) {
  const { data, ...controller } = usePager(results || [], 3);
  const [selected, setSelected] = useState(-1);
  useEffect(() => setSelected(-1), [controller.page, results]);
  return (
    <Box boxClass="px-8 pb-6" className="my-6">
      {tabHeaders ? (
        <ul
          role="tablist"
          className="-mx-8 flex font-24 shadow-2 rounded-t-2xl overflow-auto"
        >
          {tabHeaders.map((e) => (
            <li
              role="tab"
              className="py-4 px-6 aria-selected:bg-primaryLight aria-selected:text-white cursor-pointer"
              aria-selected={currentTab === e}
              key={e}
              onClick={() => onSelectTab(e)}
            >
              {e}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="h-6" />
      <TableHeader>{headerContent}</TableHeader>
      <div>
        <Printed className="hidden print:block py-10">{printHeader}</Printed>
        <ul>
          {data?.map?.((e, i) => renderItem(e, 3 * (controller.page - 1)))}
        </ul>
      </div>
      <div className="flex justify-end mt-28">
        <Pager controller={controller} />
      </div>
    </Box>
  );
}
