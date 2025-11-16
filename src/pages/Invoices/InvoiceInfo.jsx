import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import TechPaysTable from "../../components/Tables/TechPaysTable";
import LogicPaysTable from "../../components/Tables/LogicPaysTable";
import InvoiceItemTable from "../../components/Tables/InvoiceItemTable";

function InvoiceInfo() {
  return (
    <>
      <Card className="">
        <CardBody>
          <span className="ml-auto">معلومات أساسية للايرادات أو المصروفات</span>
          <div
            className="grid grid-cols-3 rtl-grid"
            style={{ justifyItems: "right" }}
          ></div>
        </CardBody>
      </Card>

      <div className="flex w-full flex-col mt-3">
        <Tabs aria-label="Options" fullWidth>
          <Tab key="tech" title="الحرفيين">
            <TechPaysTable />
          </Tab>

          <Tab key="logic" title="مراقب ورشة">
            <LogicPaysTable />
          </Tab>
          <Tab key="invoiceItem" title="المواد">
            <InvoiceItemTable />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default InvoiceInfo;
