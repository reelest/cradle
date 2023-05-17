import Box from "@/components/Box";
import LoaderAnimation from "@/components/LoaderAnimation";
import Row from "@/components/Row";
import Table from "@/components/Table";
import { usePaymentsAPI } from "@/logic/api";

export default function BottomRow() {
  const payments = usePaymentsAPI()?.payments;
  const props = ["name", "desc", "amount", "date", "time"];
  console.log(payments);
  return (
    <Row className="my-8">
      <Box className="flex-grow mr-8" boxClass="px-6 py-4">
        {payments ? (
          <Table
            rows={payments.length}
            cols={5}
            headers={["Name", "Description", "Amount", "Date", "Time"]}
            renderHooks={[
              ({ data, row, col, next }) =>
                row < 0
                  ? next()
                  : col < 3
                  ? next({ data: payments[row][props[col]] })
                  : col === 3
                  ? next({ data: "date" })
                  : next({ data: "time" }),
            ]}
          ></Table>
        ) : (
          <LoaderAnimation className="w-10 block mx-auto my-4" />
        )}
      </Box>
    </Row>
  );
}
