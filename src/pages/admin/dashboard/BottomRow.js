import Box from "@/components/Box";
import LoaderAnimation from "@/components/LoaderAnimation";
import Row from "@/components/Row";
import Table, {
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  supplyValue,
} from "@/components/Table";
import { usePaymentsAPI } from "@/logic/api";
import { formatDate, formatNumber, formatTime } from "@/utils/formatNumber";
import range from "@/utils/range";
import { useMemo, useState } from "react";

export default function BottomRow() {
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
  return (
    <Row className="my-8">
      <Box className="flex-grow mr-8" boxClass="px-6 py-4 2xl:py-6">
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
          rows={payments?.length}
          cols={5}
          headerClass="text-disabled text-left"
          rowClass="shadow-3 rounded"
          rowSpacing={1}
          headers={["Name", "Description", "Amount", "Date", "Time"]}
          renderHooks={[
            addHeaderClass("first:pl-4 pr-2 font-20t"),
            addClassToColumns("pl-4", [0]),
            addClassToColumns("w-0 pr-8 last:pr-4", range(1, 5)),
            addClassToColumns("text-right", [3]),
            addClassToColumns("py-1", range(5)),
            supplyValue((row, col) =>
              col === 0 ? (
                payments[row].name
              ) : col === 1 ? (
                <span className="inline-block align-bottom w-56 whitespace-nowrap overflow-hidden text-ellipsis">
                  {payments[row].desc}
                </span>
              ) : col === 2 ? (
                "N" + formatNumber(payments[row].amount)
              ) : col === 3 ? (
                formatDate(payments[row].date)
              ) : (
                formatTime(payments[row].date).toLowerCase()
              )
            ),
          ]}
        />

        <div className="text-right text-secondary pt-4">View All Payments</div>
      </Box>
    </Row>
  );
}
