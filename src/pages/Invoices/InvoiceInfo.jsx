import { addToast, Card, CardBody, Spinner, Tab, Tabs } from "@heroui/react";
import TechPaysTable from "../../components/Tables/TechPaysTable";
import LogicPaysTable from "../../components/Tables/LogicPaysTable";
import InvoiceItemTable from "../../components/Tables/InvoiceItemTable";
import ImagePaysTable from "../../components/Tables/ImagePaysTable";
import { useEffect, useState } from "react";
import { getInvoiceItems, getLogicPays, getTechPays } from "../../api";

function InvoiceInfo() {
  const [totals, setTotals] = useState({
    before_discount_tech: 0,
    before_discount_logic: 0,
    before_discount_invoiceItem: 0,
    after_discount_tech: 0,
    after_discount_logic: 0,
    after_discount_invoiceItem: 0,
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
          before_discount_tech: techRes.data.before_discount,
          before_discount_logic: logicRes.data.before_discount,
          before_discount_invoiceItem: invoiceRes.data.before_discount,

          after_discount_tech: techRes.data.after_discount,
          after_discount_logic: logicRes.data.after_discount,
          after_discount_invoiceItem: invoiceRes.data.after_discount,
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

  if (loading)
    return (
      <div className="flex justify-center items-center py-2 w-full">
        <Spinner
          classNames={{ label: "text-foreground" }}
          label="جاري التحميل..."
          variant="wave"
        />
      </div>
    );

  return (
    <>
      <Card>
        <CardBody>
          <span className="ml-auto font-bold text-lg">
            معلومات أساسية للإيرادات أو المصروفات
          </span>

          <div
            className="grid grid-cols-3 rtl-grid mt-3 text-right"
            style={{ justifyItems: "right" }}
          >
            <p>إجمالي الحرفيين قبل الخصم: $ {totals.before_discount_tech}</p>
            <p>
              إجمالي مراقبين الورشة قبل الخصم: $ {totals.before_discount_logic}
            </p>
            <p>
              إجمالي مواد الفاتورة قبل الخصم: ${" "}
              {totals.before_discount_invoiceItem}
            </p>
          </div>

          <div
            className="grid grid-cols-3 rtl-grid mt-2 text-right"
            style={{ justifyItems: "right" }}
          >
            <p>بعد الخصم: $ {totals.after_discount_tech}</p>
            <p>بعد الخصم: $ {totals.after_discount_logic}</p>
            <p>بعد الخصم: $ {totals.after_discount_invoiceItem}</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex w-full flex-col mt-3">
        <Tabs aria-label="Options" fullWidth>
          <Tab key="invoiceItem" title="المواد">
            <InvoiceItemTable />
          </Tab>
          <Tab key="tech" title="الحرفيين">
            <TechPaysTable />
          </Tab>
          <Tab key="logic" title="مراقب ورشة">
            <LogicPaysTable />
          </Tab>
          <Tab key="invoiceImage" title="الوثائق">
            <ImagePaysTable />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default InvoiceInfo;
