import {
  Accordion,
  AccordionItem,
  addToast,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Tab,
  Tabs,
} from "@heroui/react";
import { useEffect, useState } from "react";
import OuterTransactionTable from "../../components/Tables/OuterTransactionTable";
import MoneyTransfareTable from "../../components/Tables/MoneyTransfareTable";
import InnerTransactionTable from "../../components/Tables/InnerTransactionTable";
import {
  getAdminTresure,
  getTresureById,
  getTresureFundById,
  getTresureFunds,
} from "../../api";
import { useParams } from "react-router-dom";
import {
  AddTresureModal,
  DeleteTresureModal,
  UpdateTresureModal,
} from "../../components/Modals/TresureModals";
import {
  AddTresureFundModal,
  DeleteTresureFundModal,
  UpdateTresureFundModal,
} from "../../components/Modals/TresureFundModals";

function AdminTresure() {
  const { id } = useParams();
  const [admins, setAdmins] = useState([]);
  const [selectedTresure, setSelectedTresure] = useState(null);
  const [selectedTresureFund, setSelectedTresureFund] = useState(null);
  const [tresure, setTresures] = useState([]); // صناديق الأدمن
  const [tresureFunds, setTresureFunds] = useState([]); // ملحقات الصناديق
  const [totals, setTotals] = useState({}); //totals
  const [loading, setLoading] = useState(true);

  const [selectedTresureData, setSelectedTresureData] = useState(null);
  const [selectedTresureFundData, setSelectedTresureFundData] = useState(null);

  const fetchData = () => {
    getAdminTresure(id)
      .then((response) => {
        setAdmins(response.data.admin);
        setTotals(response.data.totals);
        setTresures(
          response.data.tresures.map((t) => ({
            id: t.tresure.id,
            name: t.tresure.name,
          }))
        );
        if (selectedTresure) {
          getTresureFunds(selectedTresure)
            .then((res) => {
              setTresureFunds(res.data.funds);
            })
            .catch((err) => {
              addToast({
                title: "حدث خطاً",
                description: `عملية برمجية رقم : ${err.message}`,
                color: "danger",
              });
            });
        }

        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  const onSelectionChange = (id) => {
    if (!id) return;

    setSelectedTresure(id);

    if (id) {
      getTresureById(id)
        .then((response) => {
          setSelectedTresureData(response.data);
        })
        .catch((err) => {
          addToast({
            title: "خطأ",
            description: err.message,
            color: "danger",
          });
        });
    } else {
      setSelectedTresureData(null);
    }

    getTresureFunds(id)
      .then((response) => {
        setTresureFunds(response.data.funds); // axios puts data in response.data
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        // setLoading(false);
      });
  };
  const fetchSelectedTresure = async () => {
    if (!selectedTresure) return;
    const res = await getTresureById(selectedTresure);
    setSelectedTresureData(res.data.tresure);
  };
  const fetchSelectedTresureFund = async () => {
    if (!selectedTresureFund) return;
    const res = await getTresureFundById(selectedTresureFund);
    setSelectedTresureFundData(res.data.tresureFund);
  };

  const onSelectionFundsChange = (id) => {
    setSelectedTresureFund(id);

    if (id) {
      getTresureFundById(id)
        .then((response) => {
          setSelectedTresureFundData(response.data);
        })
        .catch((err) => {
          addToast({
            title: "خطأ",
            description: err.message,
            color: "danger",
          });
        });
    } else {
      setSelectedTresureFundData(null);
    }
  };

  return (
    <div>
      <Card className="">
        <CardBody>
          <span className="ml-auto">معلومات</span>
          <div
            className="grid grid-cols-3 rtl-grid"
            style={{ justifyItems: "right" }}
          >
            <h1>الاسم: {admins.name}</h1>
            <h1>مجموع الصناديق: {totals.total_tresure_count}</h1>
            <h1>عدد الملحقات: {totals.total_fund_count}</h1>
            <h1>تحويلات واردة: {totals.total_incoming}</h1>
            <h1>تحويلات صادرة: {totals.total_outgoing}</h1>
            <h1>إيرادات: {totals.total_inners}</h1>
            <h1>مصاريف: {totals.total_outers}</h1>
            <h1>مجموع التحويلات: {totals.total_transfers_sum}</h1>
          </div>
        </CardBody>
      </Card>
      <Autocomplete
        allowsCustomValue={true}
        className="max-w-xs my-5"
        defaultItems={tresure}
        label="اختر الصندوق"
        variant="bordered"
        // onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      {/* Add tresure */}
      <AddTresureModal
        onSaveSuccess={fetchData}
        type={"admin"}
        id={admins.id}
      />

      {/* Accordion for Treasures */}
      {selectedTresureData && (
        <div className="">
          <Accordion variant="splitted">
            <AccordionItem
              key="main"
              aria-label={`معلومات الصندوق: ${selectedTresureData.tresure.name}`}
              title={`معلومات الصندوق: ${selectedTresureData.tresure.name}`}
            >
              <div className="bg-white rounded p-2">
                {/* === Row 1 === */}
                <div className="grid grid-cols-2 gap-4">
                  <h1>
                    <span className="text-gray-900 font-semibold">
                      مجموع الملحقات:
                    </span>{" "}
                    <span className="text-gray-700">
                      $ {selectedTresureData.stats.fund_count}
                    </span>
                  </h1>
                  <h1>
                    <span className="text-gray-900 font-semibold">
                      تحويلات واردة:
                    </span>{" "}
                    <span className="text-gray-700">
                      $ {selectedTresureData.stats.total_incoming}
                    </span>
                  </h1>
                </div>

                {/* === Row 2 === */}
                <div className="grid grid-cols-2 gap-4">
                  <h1>
                    <span className="text-gray-900 font-semibold">
                      تحويلات مستلمة:
                    </span>{" "}
                    <span className="text-gray-700">
                      $ {selectedTresureData.stats.total_outgoing}
                    </span>
                  </h1>
                  <h1>
                    <span className="text-gray-900 font-semibold">
                      مجموع التحويلات:
                    </span>{" "}
                    <span className="text-gray-700">
                      ${selectedTresureData.stats.total_transfers_sum}
                    </span>
                  </h1>
                </div>

                {/* === Row 3 === */}
                <div className="grid grid-cols-2 gap-4">
                  <h1>
                    <span className="text-gray-900 font-semibold">مصاريف:</span>{" "}
                    <span className="text-gray-700">
                      $ {selectedTresureData.stats.total_outers}
                    </span>
                  </h1>
                  <h1>
                    <span className="text-gray-900 font-semibold">
                      إيرادات:
                    </span>{" "}
                    <span className="text-gray-700">
                      $ {selectedTresureData.stats.total_inners}
                    </span>
                  </h1>
                </div>

                {/* === Row 4 ===: الحالة */}
                <div className="grid grid-cols-2 gap-4">
                  <span>
                    <span className="text-gray-900 font-semibold">الحالة:</span>{" "}
                    <span className="text-gray-700">
                      {selectedTresureData.active ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </span>
                </div>

                {/* === Row 5 – Buttons === */}
                <div className="flex justify-end gap-2">
                  <UpdateTresureModal
                    id={selectedTresureData.id}
                    tresureable_id={id}
                    onSaveSuccess={() => {
                      fetchData();
                      fetchSelectedTresure();
                    }}
                  />
                  <DeleteTresureModal
                    id={selectedTresureData.id}
                    onSaveSuccess={() => {
                      fetchData();
                      setSelectedTresure(null);
                      setSelectedTresureData(null);
                    }}
                  />
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {selectedTresure && (
        <>
          <Autocomplete
            allowsCustomValue={true}
            className="max-w-xs mx-1 my-5"
            defaultItems={tresureFunds}
            label="اختر الملحق"
            variant="bordered"
            // onInputChange={onInputChange}
            onSelectionChange={onSelectionFundsChange}
          >
            {(item) => (
              <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete>
          {/* // Add tresureFund */}
          <AddTresureFundModal
            onSaveSuccess={fetchData}
            id={selectedTresure}
            type={"admin"}
            selectedTresureId={id}
          />

          {selectedTresureFundData && (
            <div className="">
              <Accordion variant="splitted">
                <AccordionItem
                  key="fund"
                  aria-label={`معلومات الملحق: ${selectedTresureFundData.tresureFund.name}`}
                  title={`معلومات الملحق: ${selectedTresureFundData.tresureFund.name}`}
                >
                  <div className="bg-white rounded p-2">
                    {/* === Row 1 ===: معلومات الملحق الأساسية */}
                    <div className="grid grid-cols-2 gap-4">
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          الاسم:
                        </span>{" "}
                        <span className="text-gray-700">
                          {selectedTresureFundData.tresureFund.name}
                        </span>
                      </h1>
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          الوصف:
                        </span>{" "}
                        <span className="text-gray-700">
                          {selectedTresureFundData.tresureFund.desc}
                        </span>
                      </h1>
                    </div>

                    {/* === Row 2 ===: الصندوق والمبلغ */}
                    <div className="grid grid-cols-2 gap-4">
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          الصندوق:
                        </span>{" "}
                        <span className="text-gray-700">
                          {selectedTresureFundData.tresureFund.tresure?.name ??
                            "—"}
                        </span>
                      </h1>
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          المبلغ الموجود:
                        </span>{" "}
                        <span className="text-gray-700">
                          $ {selectedTresureFundData.tresureFund.amount}
                        </span>
                      </h1>
                    </div>

                    {/* === Row 3 ===: التحويلات */}
                    <div className="grid grid-cols-2 gap-4">
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          التحويلات الواردة:
                        </span>{" "}
                        <span className="text-gray-700">
                          4 {selectedTresureFundData.stats.total_incoming}
                        </span>
                      </h1>
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          التحويلات الصادرة:
                        </span>{" "}
                        <span className="text-gray-700">
                          $ {selectedTresureFundData.stats.total_outgoing}
                        </span>
                      </h1>
                    </div>

                    {/* === Row 4 ===: مجموع التحويلات + الإيرادات والمصاريف */}
                    <div className="grid grid-cols-2 gap-4">
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          مجموع التحويلات:
                        </span>{" "}
                        <span className="text-gray-700">
                          $ {selectedTresureFundData.stats.total_transfers_sum}
                        </span>
                      </h1>
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          الإيرادات :
                        </span>{" "}
                        <span className="text-gray-700">
                          $ {selectedTresureFundData.stats.total_inners}
                        </span>
                      </h1>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <h1>
                        <span className="text-gray-900 font-semibold">
                          المصاريف :
                        </span>{" "}
                        <span className="text-gray-700">
                          $ {selectedTresureFundData.stats.total_outers}
                        </span>
                      </h1>
                    </div>

                    {/* === Row 6 – Buttons === */}
                    <div className="flex justify-end gap-2">
                      <UpdateTresureFundModal
                        id={selectedTresureFundData.id}
                        tresures={tresure}
                        onSaveSuccess={() => {
                          fetchData();
                          fetchSelectedTresureFund();
                        }}
                      />
                      <DeleteTresureFundModal
                        id={selectedTresureFundData.id}
                        onSaveSuccess={() => {
                          fetchData();
                          setSelectedTresureFund(null);
                          setSelectedTresureFundData(null);
                        }}
                      />
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </>
      )}

      {/* 3 Tabs money transfare, inner transfare, outer transfare */}
      {selectedTresureFund && (
        <div className="flex w-full flex-col mt-6">
          <Tabs aria-label="Options" fullWidth keepContentMounted>
            <Tab key="moneytrans" title="تحويل صندوق">
              <MoneyTransfareTable tresurefundid={selectedTresureFund} />
            </Tab>

            <Tab key="innertrans" title="إيرادات">
              <InnerTransactionTable tresurefundid={selectedTresureFund} />
            </Tab>
            <Tab key="outertrans" title="مصاريف">
              <OuterTransactionTable tresurefundid={selectedTresureFund} />
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default AdminTresure;
