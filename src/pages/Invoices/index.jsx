import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import InvoicesTable from "../../components/Tables/InvoicesTable";
import { useParams } from "react-router-dom";

const Invoices = () => {
  const { type } = useParams();
  const getTypeName = () => {
    if (type === "innerTransaction") return "فواتير الإيرادات";
    if (type === "outerTransaction") return "فواتير المصروفات";
    return "فواتير غير محددة";
  };
  return (
    <>
      <Card className="">
        <CardBody>
          <span className="ml-auto"> {getTypeName()}</span>
          <div
            className="grid grid-cols-3 rtl-grid"
            style={{ justifyItems: "right" }}
          ></div>
        </CardBody>
      </Card>
      <div className="flex w-full flex-col mt-3">
        <Tabs aria-label="Options" fullWidth>
          <Tab key="invoiceImage" title="الفواتير"></Tab>
          <Tab key="tech" title="الفواتير مع حسومات جزئية"></Tab>
          <Tab key="invoiceItem" title="الفواتير مع حسومات كلية"></Tab>
        </Tabs>
      </div>
      {/*  invoices Table */}
      <InvoicesTable />
    </>
  );
};

export default Invoices;
