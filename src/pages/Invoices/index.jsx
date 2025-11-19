import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import InvoicesTable from "../../components/Tables/InvoicesTable";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvoices } from "../../api";

const Invoices = () => {
  const { type } = useParams();
  const [totals, setTotals] = useState({
    before_discount: 0,
    after_discount: 0,
  });
  const getTypeName = () => {
    if (type === "innerTransaction") return "فواتير الإيرادات";
    if (type === "outerTransaction") return "فواتير المصروفات";
    return "فواتير غير محددة";
  };

  useEffect(() => {
    getInvoices(type).then((res) => {
      setTotals(res.data.totals);
    });
  }, [type]);
  return (
    <>
      <Card className="">
        <CardBody>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold">{getTypeName()}</span>

            <div className="text-right">
              <div className="text-sm text-gray-600">إجمالي قبل الخصم</div>
              <div className="font-bold text-lg">{totals.before_discount}$</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">إجمالي بعد الخصم</div>
              <div className="font-bold text-lg">{totals.after_discount}$</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex w-full flex-col mt-3">
        <Tabs aria-label="Options" fullWidth>
          <Tab key="invoiceImage" title="الفواتير"></Tab>
          <Tab key="invoiceItem" title="الفواتير مع حسومات كلية"></Tab>
        </Tabs>
      </div>
      {/*  invoices Table */}
      <InvoicesTable />
    </>
  );
};

export default Invoices;
