import { Card, CardBody } from "@heroui/react";
import InvoiceTable from "../../components/Tables/InvoiceTable";

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

      {/* Add new invoices */}
      <InvoiceTable tresurefundid={1} />
    </>
  );
};

export default Invoices;
