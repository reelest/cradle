import Box from "@/components/Box";
import Pager from "@/components/Pager";
import Row from "@/components/Row";
import Spacer from "@/components/Spacer";
import Table, {
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  pageData,
  supplyValue,
} from "@/components/Table";
import TextButton from "@/components/TextButton";
import { usePaymentsAPI } from "@/logic/api";
import { formatDate, formatNumber, formatTime } from "@/utils/formatNumber";
import range from "@/utils/range";
import usePager from "@/utils/usePager";
import { useMemo, useState } from "react";

export default function BottomRow() {
  const [showMore, setShowMore] = useState(false);
  const raw_payments = usePaymentsAPI()?.payments;
  const [sort, setSort] = useState("latest");
  const payments = useMemo(
    () =>
      raw_payments &&
      raw_payments
        .slice()
        .sort((a, b) =>
          sort === "latest"
            ? a.date - b.date
            : sort == "name"
            ? a.name.localeCompare(b.name)
            : a.amount - b.amount
        ),
    [raw_payments, sort]
  );
  const PAGE_SIZE = showMore ? 15 : 10;
  const { data, ...controller } = usePager(payments || [], PAGE_SIZE);
  return (
    <Row className="my-8">
      <Box
        className="flex-grow mr-8 max-sm:font-12"
        boxClass="px-6 py-4 2xl:py-6 h-full flex flex-col overflow-auto"
        expand={showMore}
        onClose={() => setShowMore(false)}
      >
        <TableHeader>
          <h2 className="font-36b">Payments</h2>
          <select
            className="select-1"
            onChange={(e) => setSort(e.target.value)}
            value={sort}
          >
            <option value="latest">Latest Payments</option>
            <option value="name">Alphabetical Order</option>
            <option value="amount">Lowest to Highest</option>
          </select>
        </TableHeader>
        <Table
          loading={!payments}
          rows={data.length}
          cols={5}
          headerClass="text-disabled text-left"
          rowClass="shadow-3 rounded"
          rowSpacing={1}
          headers={["Name", "Description", "Amount", "Date", "Time"]}
          renderHooks={[
            addHeaderClass("first:pl-4 pr-2 font-20t"),
            pageData(controller.page, PAGE_SIZE),
            addClassToColumns("pl-4", [0]),
            addClassToColumns("w-0 pr-8 last:pr-4", range(1, 5)),
            addClassToColumns("text-right", [3]),
            addClassToColumns("py-1", range(5)),
            supplyValue((row, col) =>
              col === 0 ? (
                data[row].name
              ) : col === 1 ? (
                <span className="inline-block align-bottom w-56 whitespace-nowrap overflow-hidden text-ellipsis">
                  {data[row].desc}
                </span>
              ) : col === 2 ? (
                "N" + formatNumber(data[row].amount)
              ) : col === 3 ? (
                formatDate(data[row].date)
              ) : (
                formatTime(data[row].date).toLowerCase()
              )
            ),
          ]}
        />
        <Spacer className="my-4" />
        <div className="flex justify-end">
          {showMore ? (
            <Pager controller={controller} />
          ) : (
            <TextButton
              onClick={() => setShowMore(true)}
              color="text-secondary"
              className="text-right  pt-4"
            >
              View all payments
            </TextButton>
          )}
        </div>
      </Box>
    </Row>
  );
}
