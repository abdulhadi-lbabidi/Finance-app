import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import OuterTransactionTable from "../../components/Tables/OuterTransactionTable";
import MoneyTransfareTable from "../../components/Tables/MoneyTransfareTable";
import InnerTransactionTable from "../../components/Tables/InnerTransactionTable";
import { getAdminTresure, getTresureFunds } from "../../api";
import { useParams } from "react-router-dom";

function AdminTresure() {
  const [admins, setAdmins] = useState([]);
  const [selectedTresure, setSelectedTresure] = useState(null);
  const [selectedTresureFund, setSelectedTresureFund] = useState(null);
  const [tresure, setTresures] = useState([]);
  const [tresureFunds, setTresureFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchData = () => {
    // Using axios
    getAdminTresure(id)
      .then((response) => {
        setAdmins(response.data.admin); // axios puts data in response.data
        setTresures(response.data.tresures); // axios puts data in response.data
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
      <Card className="my-5">
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

      {selectedTresure && (
        <Autocomplete
          allowsCustomValue={true}
          className="max-w-xs my-5"
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
      )}
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
