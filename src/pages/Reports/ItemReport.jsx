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
import { getWorkshopTresure, getTresureFunds, getWorkshops } from "../../api";

function ItemReport() {
  const [workshops, setWorkshops] = useState([]);
  const [tresures, setTresures] = useState([]);
  const [tresureFunds, setTresureFunds] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedTresure, setSelectedTresure] = useState(null);
  const [selectedTresureFund, setSelectedTresureFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    // Using axios
    getWorkshops()
      .then((response) => {
        setWorkshops(response.data.workshops); // axios puts data in response.data
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

  const onSelectionWorkshopChange = (id) => {
    setSelectedWorkshop(id);
    if (id === null) {
    } else {
      getWorkshopTresure(id)
        .then((response) => {
          setTresures(response.data.tresures); // axios puts data in response.data
          // setLoading(false);
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
  const onSelectionTresureChange = (id) => {
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
      <Autocomplete
        allowsCustomValue={true}
        className="max-w-xs my-5"
        defaultItems={workshops}
        label="اختر الورشة"
        variant="bordered"
        // onInputChange={onInputChange}
        onSelectionChange={onSelectionWorkshopChange}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      {selectedWorkshop && (
        <Autocomplete
          allowsCustomValue={true}
          className="max-w-xs my-5"
          defaultItems={tresures}
          label="اختر الصندوق"
          variant="bordered"
          // onInputChange={onInputChange}
          onSelectionChange={onSelectionTresureChange}
        >
          {(itemd) => (
            <AutocompleteItem key={itemd.id}>{itemd.name}</AutocompleteItem>
          )}
        </Autocomplete>
      )}

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
      <div>
        <div className="border h-fit p-3">
          <label htmlFor="date-input">اختر التاريخ:</label>
          <input
            id="date-input"
            type="date"
            value={inventory.fromdate}
            onChange={(ev) =>
              setInventory({
                ...inventory,
                fromdate: ev.target.value,
              })
            }
          />
        </div>
        <div className="border h-fit p-3">
          <label htmlFor="date-input">اختر التاريخ:</label>
          <input
            id="date-input"
            type="date"
            value={inventory.fromdate}
            onChange={(ev) =>
              setInventory({
                ...inventory,
                fromdate: ev.target.value,
              })
            }
          />
        </div>
      </div>
      {/* {selectedTresureFund && (
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
      )} */}
    </div>
  );
}

export default ItemReport;
