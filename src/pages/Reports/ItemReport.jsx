import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Checkbox,
  Tab,
  Tabs,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  getTresureByType,
  getTresureFundsByTresureId,
  getTresuresByUser,
  getUsersByType,
} from "../../api";
import InnerTransactionTableReport from "./OuterTransactionTableReport";
import OuterTransactionTableReport from "./innerTransactionTableReport";

function ItemReport() {
  const [type, setType] = useState(null);
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [tresures, setTresures] = useState([]);
  const [selectedTresure, setSelectedTresure] = useState(null);

  const [funds, setFunds] = useState([]);

  const [selectedTresureFund, setSelectedTresureFund] = useState(null);

  const typeTranslations = {
    admin: "مدير",
    customer: "عميل",
    employee: "موظف",
    workshop: "صاحب ورشة",
    office: "مكتب",
    deposit: "أمانات",
  };

  //==============================
  // LOAD TYPES
  //==============================
  useEffect(() => {
    setLoadingTypes(true);
    getTresureByType()
      .then((res) => {
        setTypes(
          res.data.truserTtype.map((t) => ({
            key: t,
            label: typeTranslations[t] || t,
          }))
        );
        setLoadingTypes(false);
      })
      .catch(() => setLoadingTypes(false));
  }, []);

  //==============================
  // TYPE CHANGE
  //==============================
  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setSelectedUser(null);
    setSelectedTresure(null);
    setFunds([]);

    getUsersByType(selectedType)
      .then((res) => setUsers(res.data.users))
      .catch((err) =>
        addToast({
          title: "خطأ",
          description: "رجاء اختيار نوع الصندوق",
          color: "danger",
        })
      );
  };

  //==============================
  // USER CHANGE
  //==============================
  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    setSelectedTresure(null);
    setFunds([]);

    getTresuresByUser(userId, type)
      .then((res) => setTresures(res.data.tresures))
      .catch((err) =>
        addToast({ title: "خطأ", description: err.message, color: "danger" })
      );
  };

  //==============================
  // TRESURE CHANGE
  //==============================
  const handleTresureChange = (tresureId) => {
    setSelectedTresure(tresureId);
    setFunds([]);

    getTresureFundsByTresureId(tresureId)
      .then((res) => setFunds(res.data.funds))
      .catch((err) =>
        addToast({ title: "خطأ", description: err.message, color: "danger" })
      );
  };
  const handleFundChange = (fundId) => {
    setSelectedTresureFund(fundId);
  };

  return (
    <div>
      <Card className="">
        <CardBody>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold">تقرير المواد</span>
          </div>
        </CardBody>
      </Card>
      {/* نوع الصندوق */}
      <div className="flex items-center gap-4 mt-4">
        <div className="">
          <Autocomplete
            className="max-w-xs"
            allowsCustomValue={true}
            label="نوع الصندوق"
            placeholder={loadingTypes ? "جاري التحميل..." : "اختر النوع"}
            onSelectionChange={handleTypeChange}
          >
            {types.map((t) => (
              <AutocompleteItem key={t.key} value={t.key}>
                {t.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <div className=" flex justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox size="lg">اختيار جميع الأنواع</Checkbox>
          </label>
        </div>
      </div>
      {/* المستخدم */}
      {type && (
        <div className="flex items-center gap-4 mt-4">
          <div className="">
            <Autocomplete
              className="max-w-xs"
              label="اختر المستخدم"
              defaultItems={users}
              onSelectionChange={handleUserChange}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className=" flex justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox size="lg">اختيار جميع المستخدمين</Checkbox>
            </label>
          </div>
        </div>
      )}
      {/* الصندوق */}
      {selectedUser && (
        <div className="flex items-center gap-4 mt-4">
          <div className="">
            <Autocomplete
              label="اختر الصندوق"
              className="max-w-xs"
              defaultItems={tresures}
              onSelectionChange={handleTresureChange}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className=" flex justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox size="lg">اختيار جميع الصناديق</Checkbox>
            </label>
          </div>
        </div>
      )}
      {/* الملحق */}
      {selectedTresure && (
        <div className="flex items-center gap-4 mt-4">
          <div className="">
            <Autocomplete
              label="اختر الملحق"
              className="max-w-xs"
              defaultItems={funds}
              onSelectionChange={handleFundChange}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          <div className=" flex justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox size="lg">اختيار جميع الملحقات</Checkbox>
            </label>
          </div>
        </div>
      )}

      {selectedTresureFund && (
        <div className="flex w-full flex-col mt-6">
          <Tabs aria-label="Options" fullWidth keepContentMounted>
            <Tab key="innertrans" title="مواد مصروفة">
              <InnerTransactionTableReport fundId={selectedTresureFund} />
            </Tab>
            <Tab key="outertrans" title="مواد مرتجعة">
              <OuterTransactionTableReport fundId={selectedTresureFund} />
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default ItemReport;
