import { Card, CardBody } from "@heroui/react";
import InvoicesTable from "../../components/Tables/InvoicesTable";

const Invoices = () => {
  return (
    <>
      <Card className="my-5">
        <CardBody>
          <span className="ml-auto"> مجاميع الفواتير</span>
          <div
            className="grid grid-cols-3 rtl-grid"
            style={{ justifyItems: "right" }}
          ></div>
        </CardBody>
      </Card>

      {/*  invoices Table */}
      <InvoicesTable />
    </>
  );
};

export default Invoices;
