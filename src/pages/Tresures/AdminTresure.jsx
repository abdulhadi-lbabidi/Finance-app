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
  const [admins, setAdmins] = useState([]);
  const [selectedTresure, setSelectedTresure] = useState(null);
  const [selectedTresureFund, setSelectedTresureFund] = useState(null);
  const [tresure, setTresures] = useState([]);
  const [tresureFunds, setTresureFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [selectedTresureData, setSelectedTresureData] = useState(null);
  const [selectedTresureFundData, setSelectedTresureFundData] = useState(null);

  const fetchData = () => {
    getAdminTresure(id)
      .then((response) => {
        setAdmins(response.data.admin);
        setTresures(response.data.tresures);

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
          setSelectedTresureData(response.data.tresure);
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
          setSelectedTresureFundData(response.data.tresureFund);
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
            <h1>مجموع الصناديق: {}</h1>
            <h1>تحويلات واردة: {}</h1>
            <h1>تحويلات مستلمة: {}</h1>
            <h1>مصاريف: {}</h1>
            <h1>إيرادات: {}</h1>
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
              aria-label="معلومات الصندوق"
              title={`معلومات الصندوق: ${selectedTresureData?.name ?? ""}`}
            >
              <div className="bg-white rounded ">
                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>
                    مجاميع تحويلات الصندوق: {selectedTresureData.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>
                    مجاميع تحويلات الصادرة من الصندوق:{" "}
                    {selectedTresureData.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>
                    مجاميع تحويلات الواردة من الصندوق:{" "}
                    {selectedTresureData.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>
                    مجاميع ايرادات الصندوق: {selectedTresureData.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>مجاميع مصاريف الصندوق: {selectedTresureData.name}</span>
                </div>

                <div className="grid grid-cols-2 text-gray-800 font-semibold">
                  <span>الاسم: {selectedTresureData.name}</span>
                </div>

                <div className="grid grid-cols-3 items-center text-gray-700">
                  <span>
                    الحالة:{" "}
                    <span
                      className={
                        selectedTresureData.active
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {selectedTresureData.active ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </span>

                  <span></span>

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
                  aria-label="معلومات الملحق"
                  title={`معلومات الملحق: ${
                    selectedTresureFundData?.name ?? ""
                  }`}
                >
                  <div className="bg-white rounded ">
                    <div className="grid grid-cols-1 text-gray-800 font-semibold">
                      <div className="grid grid-cols-2 text-gray-800 font-semibold">
                        <span>
                          مجاميع تحويلات الملحقات الواردة:{" "}
                          {selectedTresureData.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 text-gray-800 font-semibold">
                        <span>
                          مجاميع ايرادات الملحقات الصادرة:{" "}
                          {selectedTresureData.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 text-gray-800 font-semibold">
                        <span>مجاميع الملحق: {selectedTresureData.name}</span>
                      </div>

                      <span>الاسم: {selectedTresureFundData.name}</span>
                      <span> الوصف: {selectedTresureFundData.desc}</span>
                      <span>
                        الصندوق:
                        {selectedTresureFundData.tresure?.name ?? "—"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-gray-700">
                      <span>
                        الحالة:{" "}
                        <span
                          className={
                            selectedTresureFundData.active
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {selectedTresureFundData.active
                            ? "مفعّل"
                            : "غير مفعّل"}
                        </span>
                      </span>

                      <span></span>

                      <div className="flex justify-end gap-2">
                        <UpdateTresureFundModal
                          id={selectedTresureFundData.id}
                          onSaveSuccess={() => {
                            fetchData();
                            fetchSelectedTresureFund();
                          }}
                          tresures={tresure}
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
