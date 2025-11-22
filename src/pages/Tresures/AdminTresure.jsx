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
import { getAdminTresure, getTresureFunds } from "../../api";
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

  // const fetchData = () => {
  //   // Using axios
  //   getAdminTresure(id)
  //     .then((response) => {
  //       setAdmins(response.data.admin); // axios puts data in response.data
  //       setTresures(response.data.tresures); // axios puts data in response.data
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       addToast({
  //         title: "حدث خطاً",
  //         description: `عملية برمجية رقم : ${err.message}`,
  //         color: "danger",
  //       });
  //       setLoading(false);
  //     });
  // };

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
    setSelectedTresure(id);
    if (id === null) {
    } else {
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
    }
  };

  const onSelectionFundsChange = (id) => {
    setSelectedTresureFund(id);
    if (id === null) {
    } else {
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
      <div className="">
        <Accordion variant="splitted">
          <AccordionItem
            key="main"
            aria-label="جميع الصناديق"
            title="جميع الصناديق"
          >
            {/* All Treasures Table */}
            <div className=" bg-white p-2 rounded ">
              {/* Table header */}
              <div className="grid grid-cols-4 font-bold text-gray-700 border-b pb-2">
                <span>الاسم</span>
                <span>الحالة</span>
                <span>عمليات</span>
              </div>
              {/* Rows */}
              {tresure.map((tre) => (
                <div
                  key={tre.id}
                  className="grid grid-cols-4 text-gray-700 py-4 border-b items-center"
                >
                  {/* Name */}
                  <span>{tre.name}</span>

                  {/* Active */}
                  <span
                    className={tre.active ? "text-green-600" : "text-red-600"}
                  >
                    {tre.active ? "مفعّل" : "غير مفعّل"}
                  </span>

                  {/* Edit + Delete */}
                  <div className="flex gap-2">
                    <UpdateTresureModal id={tre.id} onSaveSuccess={fetchData} />
                    <DeleteTresureModal id={tre.id} onSaveSuccess={fetchData} />
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ملحق */}
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

          {/* Accordion for Treasures */}
          <div className="">
            <Accordion variant="splitted">
              <AccordionItem
                key="main"
                aria-label="جميع الملحقات"
                title="جميع الملحقات"
              >
                {/* All Treasures Table */}
                <div className=" bg-white p-2 rounded ">
                  {/* Table header */}
                  <div className="grid grid-cols-4 font-bold text-gray-700 border-b pb-2">
                    <span>الاسم</span>
                    <span>الوصف</span>
                    <span>الصندوق</span>
                    <span>عمليات</span>
                  </div>
                  {/* Rows */}
                  {tresureFunds.map((tre) => (
                    <div
                      key={tre.id}
                      className="grid grid-cols-4 text-gray-700 py-4 border-b items-center"
                    >
                      {/* Name */}
                      <span>{tre.name}</span>

                      {/* desc */}
                      <span>{tre.desc}</span>

                      {/* related treasure */}
                      <span>{tre.tresure?.name ?? "—"}</span>

                      {/* Edit + Delete */}
                      <div className="flex gap-2">
                        <UpdateTresureFundModal
                          id={tre.id}
                          onSaveSuccess={fetchData}
                          tresures={tresure}
                        />
                        <DeleteTresureFundModal
                          id={tre.id}
                          onSaveSuccess={fetchData}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
      {/* 3 Tabs money transfare, inner transfare, outer transfare */}
      {selectedTresureFund && (
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" fullWidth>
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
