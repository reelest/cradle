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
  useStudentsAPI,
  useTeachersAPI,
} from "@/logic/api";
import { formatDate } from "@/utils/formatNumber";
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

export default function FinancialsView() {
  const [active, setActive] = useState("courses");
  const [schoolType, setSchoolType] = useState("high school");
  const classes = useClassesAPI(schoolType)?.classes;
  const [currentClass, selectClass] = useArrayState(classes);
  const courses = useCoursesAPI(currentClass)?.courses;

  const branches = useMemo(
    () =>
      courses &&
      courses
        .map((e) => e.branch)
        .sort()
        .filter(uniq),
    [courses]
  );
  const [branch, setBranch] = useArrayState(branches);

  const filtered = useMemo(
    () => courses && courses.filter((e) => e.branch === branch),
    [branch, courses]
  );

  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <h1 className="font-36b">Financial</h1>
      <div class="flex border-b border-transparentGray py-8 mb-8 justify-end">
        <SearchInput />
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
      <div className="h-8" />
      <TabbedTable
        currentTab={currentClass}
        onSelectTab={selectClass}
        tabHeaders={classes}
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
              onChange={(e) => {
                setBranch(e.target.value);
              }}
              value={branch}
            >
              {branches
                ? branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {currentClass}, {branch}
                    </option>
                  ))
                : null}
            </select>
          </>
        }
        headers={["NAME", "DESCRIPTION", "ASSIGNED TEACHER"]}
        results={filtered}
        renderHooks={[
          addClassToColumns("min-w-[240px]", [0]),
          addClassToColumns("min-w-[120px]", [2]),
          supplyValue((row, col) => {
            const item = filtered[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.desc;
              case 2:
                return item.assignedTeacher;
            }
          }),
          clipColumn(1, "max-w-[30vw] pr-8"),
        ]}
      />
    </div>
  );
}

function TabbedTable({
  results,
  headers,
  tabHeaders,
  onSelectTab,
  currentTab,
  headerContent,
  printHeader,
  renderHooks,
}) {
  const { data, ...controller } = usePager(results || [], 10);
  const tableRef = useRef();
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
      <div ref={tableRef}>
        <Printed className="hidden print:block py-10">{printHeader}</Printed>
        <Table
          loading={!results}
          scrollable
          cols={headers.length}
          rows={Math.min(10, results?.length)}
          headers={headers}
          rowSpacing={1}
          headerClass="text-disabled text-left"
          rowClass={(row) =>
            `${selected === row ? "bg-primaryLight text-white" : "bg-white"} ${
              row >= data.length ? "invisible" : "shadow-3"
            }`
          }
          onClickRow={(e, row) => setSelected(selected === row ? -1 : row)}
          renderHooks={[
            pageData(controller.page - 1, 10),
            addHeaderClass("first:pl-4 pr-2 last:pr-0 font-20t"),
            addClassToColumns(
              "first:pl-4 pr-2 pt-1 pb-1 first:rounded-l last:rounded-r"
            ),
            ...renderHooks,
          ]}
        />
      </div>
      <div className="flex justify-end mt-28">
        <Pager controller={controller} />
      </div>
      <div className="flex justify-end mt-8">
        <ThemedButton bg="bg-primary" variant="classic" className="mx-2">
          Edit
        </ThemedButton>
        <ThemedButton bg="bg-secondary" variant="classic" className="mx-2">
          Delete
        </ThemedButton>
        <ThemedButton
          onClick={() => printElement(tableRef.current)}
          variant="classic"
          className="mx-2"
        >
          Print
        </ThemedButton>
      </div>
    </Box>
  );
}
