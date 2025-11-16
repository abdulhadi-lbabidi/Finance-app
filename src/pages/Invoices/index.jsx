import { Card, CardBody } from "@heroui/react";
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

      {/*  invoices Table */}
      <InvoicesTable />
    </>
  );
};

export default Invoices;
