import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  addToast,
  Tooltip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import {
  addMoneyTransfare,
  deleteMoneyTransfare,
  getMoneyTransfaredata,
  getTresureByType,
  getTresureFundsByTresureId,
  getTresuresByUser,
  getUsersByType,
  updateMoneyTransfare,
} from "../../api";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddMoneyTransfareModal({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const [type, setType] = useState(null);
  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [tresures, setTresures] = useState([]);
  const [selectedTresure, setSelectedTresure] = useState(null);

  const [funds, setFunds] = useState([]);
  const [fromFund, setFromFund] = useState(null);
  const [toFund, setToFund] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const currentFundId = Number(urlParams.get("fund"));

  const [moneyTransfare, setMoneyTransfare] = useState({
    name: "",
    desc: "",
    amount: "",
    from_tresure_fund_id: null,
    to_tresure_fund_id: null,
  });

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
        addToast({ title: "خطأ", description: err.message, color: "danger" })
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

  //==============================
  // SUBMIT
  //==============================
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addMoneyTransfare({
        ...moneyTransfare,
        from_tresure_fund_id: currentFundId,
        to_tresure_fund_id: toFund,
      });

      addToast({
        title: "نجاح",
        description: "تم إضافة التحويل بنجاح",
        color: "success",
      });

      setLoading(false);
      onSaveSuccess();
      onClose();
    } catch (err) {
      setLoading(false);

      const errorMessage =
        err?.response?.data?.message || err.message || "حدث خطأ غير متوقع";

      addToast({
        title: "خطأ",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        إضافة تحويل جديد
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader>إضافة تحويل جديد</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    value={moneyTransfare.name}
                    onChange={(e) =>
                      setMoneyTransfare({
                        ...moneyTransfare,
                        name: e.target.value,
                      })
                    }
                    className="w-full"
                  />

                  <Input
                    label="ملاحظات"
                    value={moneyTransfare.desc}
                    onChange={(e) =>
                      setMoneyTransfare({
                        ...moneyTransfare,
                        desc: e.target.value,
                      })
                    }
                    className="w-full"
                  />

                  <Input
                    isRequired
                    label="القيمة"
                    value={moneyTransfare.amount}
                    onChange={(e) =>
                      setMoneyTransfare({
                        ...moneyTransfare,
                        amount: e.target.value,
                      })
                    }
                    className="w-full"
                  />

                  <Autocomplete
                    allowsCustomValue={true}
                    label="نوع الصندوق"
                    placeholder={
                      loadingTypes ? "جاري التحميل..." : "اختر النوع"
                    }
                    onSelectionChange={handleTypeChange}
                    className="w-full"
                  >
                    {types.map((t) => (
                      <AutocompleteItem key={t.key} value={t.key}>
                        {t.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  {type && (
                    <Autocomplete
                      label="اختر المستخدم"
                      defaultItems={users}
                      onSelectionChange={handleUserChange}
                      className="w-full"
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}

                  {selectedUser && (
                    <Autocomplete
                      label="اختر الصندوق"
                      defaultItems={tresures}
                      onSelectionChange={handleTresureChange}
                      className="w-full"
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}

                  {selectedTresure && (
                    <>
                      {/* <Autocomplete
                        label="من الملحق"
                        defaultItems={funds}
                        selectedKey={
                          currentFundId ? currentFundId.toString() : null
                        }
                        isDisabled={true}
                        className="w-full"
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete> */}
                      {/* <div className="p-2 border rounded-md bg-default-100">
                        {currentFundId
                          ? `الملحق الحالي (ID: ${currentFundId})`
                          : "لم يتم تحديد ملحق"}
                      </div> */}
                      <p className="text-xs text-foreground-400 mt-5 mr-1">
                        * يتم استخدام الملحق الحالي من الصفحة
                      </p>
                      <Autocomplete
                        label="إلى الملحق"
                        defaultItems={funds}
                        onSelectionChange={setToFund}
                        className="w-full"
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  إغلاق
                </Button>

                <Button type="submit" color="primary" isLoading={loading}>
                  {loading ? "جاري التحميل..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateMoneyTransfareModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [tresureFunds, setTresureFunds] = useState([]);
  const [loadingTresureFunds, setLoadingTresureFunds] = useState(true);
  const [moneyTransfare, setMoneyTransfare] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    from_tresure_fund_id: null,
    to_tresure_fund_id: null,
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getMoneyTransfaredata(id);
      setMoneyTransfare(response.data.moneyTransfer);
      // const tresureId = response.data.moneyTransfer.fromtresurefund.tresure_id;

      //get getTresure Funds By TresureId
      getTresureFundsByTresureId(id)
        .then((response) => {
          setTresureFunds(response.data.funds); // axios get data in response.data
          setLoadingTresureFunds(false);
        })
        .catch((err) => {
          addToast({
            title: "حدث خطاً",
            description: `عملية برمجية رقم : ${err.message}`,
            color: "danger",
          });
          setLoadingTresureFunds(false);
        });

      setLoading(false);
      onOpen();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: err.message,
        color: "danger",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMoneyTransfare(moneyTransfare.id, moneyTransfare);
      addToast({
        title: "نجاح",
        description: "تم تعديل التحويل بنجاح",
        color: "success",
      });
      setLoading(false);
      onSaveSuccess();
      onClose();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: err.message,
        color: "danger",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip content="تعديل بيانات التحويل" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader>تعديل بيانات التحويل</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input
                  isRequired
                  label="الاسم"
                  value={moneyTransfare.name}
                  onChange={(e) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  label="ملاحظات"
                  value={moneyTransfare.desc}
                  onChange={(e) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      desc: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <Input
                  isRequired
                  label="القيمة"
                  value={moneyTransfare.amount}
                  onChange={(e) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      amount: e.target.value,
                    })
                  }
                  className="w-full"
                />

                <Autocomplete
                  label="من الملحق"
                  selectedKey={moneyTransfare.from_tresure_fund_id?.toString()}
                  onSelectionChange={(val) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      from_tresure_fund_id: val,
                    })
                  }
                >
                  {tresureFunds.map((item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Autocomplete
                  label="إلى الملحق"
                  selectedKey={moneyTransfare.to_tresure_fund_id?.toString()}
                  onSelectionChange={(val) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      to_tresure_fund_id: val,
                    })
                  }
                >
                  {tresureFunds.map((item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  {loading ? "جاري التحميل..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteMoneyTransfareModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [moneyTransfare, setMoneyTransfare] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteMoneyTransfare(moneyTransfare.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف العملية`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      onSaveSuccess();
      onClose();
    } catch (err) {
      addToast({
        title: "حدث خطاً",
        description: `عملية برمجية رقم : ${err.message}`,
        color: "danger",
      });
      setLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleOpen = () => {
    // Using axios
    getMoneyTransfaredata(id)
      .then((response) => {
        setLoading(false);
        setMoneyTransfare(response.data.moneyTransfer); // axios puts data in response.data
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
    onOpen();
  };
  return (
    <>
      <Tooltip content="حذف  التحويل" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف التحويل
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={moneyTransfare.name}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="danger" type="submit" isLoading={loading}>
                  {loading ? "جاري التحميل ..." : "حذف"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
