import { useState } from "react";
import { ProfilePic, SearchInput } from "../dashboard/TopRow";
import ThemedButton from "@/components/ThemedButton";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import Box from "@/components/Box";
import Table, {
  TableButton,
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  onClickHeader,
  supplyValue,
} from "@/components/Table";
import { useAdministratorsAPI } from "@/logic/api";
import LoaderAnimation from "@/components/LoaderAnimation";
import { formatDate } from "@/utils/formatNumber";
import usePager from "@/utils/usePager";
import Spacer from "@/components/Spacer";
import Pager from "@/components/Pager";

const TABS = {
  administrators: {
    name: "Administrators",
    component: Administrators,
  },
  teachers: {
    name: "Teachers",
    component: Teachers,
  },
  parents: {
    name: "Parents",
    component: Parents,
  },
  students: {
    name: "Students",
    component: Students,
  },
};
export default function UsersView() {
  const [active, setActive] = useState("administrators");
  const ActiveTab = TABS[active].component;
  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <h1 className="font-36b">Users</h1>
      <ul className="border-b border-transparentGray py-8 mb-8">
        {Object.keys(TABS).map((e, i) => (
          <ThemedButton
            as="li"
            variant={active === e ? "classic" : "classicWhite"}
            onClick={() => setActive(e)}
            className="inline-block mx-4 shadow-1"
            key={e}
          >
            {TABS[e].name}
          </ThemedButton>
        ))}
      </ul>
      <h3 className="font-32b">{TABS[active].name}</h3>
      <ActiveTab />
      <div className="h-8" />
    </div>
  );
}

function Administrators() {
  const admins = useAdministratorsAPI()?.admins;
  const { data, ...controller } = usePager(admins || [], 10);
  const [selected, setSelected] = useState(-1);
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Add new administrator</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <Box boxClass="px-8 py-6">
        <TableHeader>
          <span />
          <TableButton>
            Delete
            <TrashIcon className="ml-0.5 relative top-1" width={20} />
          </TableButton>
        </TableHeader>
        <Table
          loading={!admins}
          scrollable
          cols={4}
          rows={10}
          headers={["Name", "Email", "Date Created", "Status"]}
          rowSpacing={1}
          headerClass="text-disabled text-left"
          rowClass={(row) =>
            `${selected === row ? "bg-primaryLight text-white" : "bg-white"} ${
              row >= data.length ? "invisible" : "shadow-3"
            }`
          }
          onClickRow={(e, row) => setSelected(selected === row ? -1 : row)}
          renderHooks={[
            addHeaderClass("first:pl-4 pr-2 last:pr-0 font-20t"),
            addClassToColumns(
              "first:pl-4 pr-2 pt-1 pb-1 first:rounded-l last:rounded-r"
            ),
            addClassToColumns("text-center", [3]),
            addClassToColumns("min-w-[240px]", [0]),
            supplyValue((row, col) => {
              const item = data[row];
              if (!item) return "--";
              switch (col) {
                case 0:
                  return item.name;
                case 1:
                  return item.email;
                case 2:
                  return formatDate(item.dateCreated);
                case 3:
                  return (
                    <span
                      className={`inline-block w-4 h-4 rounded-full border align-middle border-transparentGray ${
                        item.status ? "bg-green-500" : "bg-black2"
                      }`}
                    ></span>
                  );
              }
            }),
          ]}
        />
        <p className="flex items-center mt-28">
          <Spacer />
          <span className="font-32b mr-4">Total</span>
          <span className="font-20t text-disabled">{admins?.length}</span>
          <Spacer />
          <Pager controller={controller} />
        </p>
      </Box>
    </>
  );
}
function Teachers() {}
function Parents() {}
function Students() {}
