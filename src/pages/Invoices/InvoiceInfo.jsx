import { addToast, Card, CardBody, Tab, Tabs } from "@heroui/react";
import TechPaysTable from "../../components/Tables/TechPaysTable";
import LogicPaysTable from "../../components/Tables/LogicPaysTable";
import InvoiceItemTable from "../../components/Tables/InvoiceItemTable";
import { useEffect, useState } from "react";
import { getInvoiceItems, getLogicPays, getTechPays } from "../../api";
import ImagePaysTable from "../../components/Tables/ImagePaysTable";

function InvoiceInfo() {
  const [totals, setTotals] = useState({
    tech: 0,
    logic: 0,
    invoiceItem: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techRes, logicRes, invoiceRes] = await Promise.all([
          getTechPays(),
          getLogicPays(),
          getInvoiceItems(),
        ]);

        setTotals({
          tech: techRes.data.totalFinalPrice,
          logic: logicRes.data.totalFinalPrice,
          invoice: invoiceRes.data.totalFinalPrice,
        });
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `خطأ: ${err.message}`,
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <>
      <Card>
        <CardBody>
          <span className="ml-auto">معلومات أساسية للإيرادات أو المصروفات</span>

          <div
            className="grid grid-cols-3 rtl-grid"
            style={{ justifyItems: "right" }}
          >
            <p>إجمالي الحرفيين: $ {totals.tech}</p>
            <p>إجمالي مراقب الورشة: $ {totals.logic}</p>
            <p>إجمالي مواد الفاتورة: $ {totals.invoice}</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex w-full flex-col mt-3">
        <Tabs aria-label="Options" fullWidth>
          <Tab key="invoiceImage" title="الوثائق">
            <ImagePaysTable />
          </Tab>
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
