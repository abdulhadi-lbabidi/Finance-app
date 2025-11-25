import { useState } from "react";
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
  NumberInput,
  Checkbox,
} from "@heroui/react";

import {
  addOuterTransaction,
  deleteOuterTransaction,
  getOuterTransactiondata,
  updateOuterTransaction,
} from "../../api";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddOuterTransactionModal({ onSaveSuccess, tresurefundid }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const today = new Date();

  const [outerTransaction, setOuterTransaction] = useState({
    id: null,
    name: "",
    desc: "",
    payed: "",
    amount: "",
    indate: "",
    tresure_fund_id: tresurefundid,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOuterTransaction(outerTransaction);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setOuterTransaction({
        ...outerTransaction,
        name: "",
      });
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

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        إضافة مصروف جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة مصروف جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={outerTransaction.name}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  label="ملاحظات"
                  type="text"
                  value={outerTransaction.desc}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      desc: ev.target.value,
                    })
                  }
                />
                <div className="border h-fit p-3">
                  <label htmlFor="date-input">اختر التاريخ:</label>
                  <input
                    id="date-input"
                    type="date"
                    value={outerTransaction.indate}
                    onChange={(ev) =>
                      setOuterTransaction({
                        ...outerTransaction,
                        indate: ev.target.value,
                      })
                    }
                  />
                </div>
                <NumberInput
                  isRequired
                  label="المبلغ"
                  placeholder="ادخل القيمة"
                  showMonthAndYearPickers
                  value={outerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isSelected={outerTransaction.payed}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      payed: ev,
                    })
                  }
                >
                  مُستلم
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  {loading ? "جاري التحميل ..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateOuterTransactionModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [outerTransaction, setOuterTransaction] = useState({
    id: id,
    name: "",
    desc: "",
    payed: "",
    amount: "",
    indate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOuterTransaction(outerTransaction.id, outerTransaction);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت تعديل المدير`,
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
    getOuterTransactiondata(id)
      .then((response) => {
        setLoading(false);
        setOuterTransaction(response.data.OuterTransaction); // axios puts data in response.data
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
      <Tooltip content="تعديل بيانات المصروف" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات مدير
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={outerTransaction.name}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  label="ملاحظات"
                  type="text"
                  value={outerTransaction.desc}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      desc: ev.target.value,
                    })
                  }
                />
                <div className="border h-fit p-3">
                  <label htmlFor="date-input">اختر التاريخ:</label>
                  <input
                    id="date-input"
                    type="date"
                    value={outerTransaction.indate}
                    onChange={(ev) =>
                      setOuterTransaction({
                        ...outerTransaction,
                        indate: ev.target.value,
                      })
                    }
                  />
                </div>
                <NumberInput
                  isRequired
                  label="المبلغ"
                  placeholder="ادخل القيمة"
                  showMonthAndYearPickers
                  value={outerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isSelected={outerTransaction.payed}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      payed: ev,
                    })
                  }
                >
                  مُستلم
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  {loading ? "" : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteOuterTransactionModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [outerTransaction, setOuterTransaction] = useState({
    id: id,
    name: "",
    desc: "",
    payed: "",
    amount: "",
    indate: "",
  });
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteOuterTransaction(outerTransaction.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف المدير`,
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
    getOuterTransactiondata(id)
      .then((response) => {
        setLoading(false);
        setOuterTransaction(response.data.OuterTransaction); // axios puts data in response.data
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
      <Tooltip content="حذف المصروف" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف المصروف
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={outerTransaction.name}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  isDisabled
                  label="ملاحظات"
                  type="text"
                  value={outerTransaction.desc}
                  onChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      desc: ev.target.value,
                    })
                  }
                />
                <div className="border h-fit p-3">
                  <label htmlFor="date-input">اختر التاريخ:</label>
                  <input
                    disabled
                    id="date-input"
                    type="date"
                    value={outerTransaction.indate}
                    onChange={(ev) =>
                      setOuterTransaction({
                        ...outerTransaction,
                        indate: ev.target.value,
                      })
                    }
                  />
                </div>
                <NumberInput
                  isDisabled
                  label="المبلغ"
                  placeholder="ادخل القيمة"
                  showMonthAndYearPickers
                  value={outerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isDisabled
                  isSelected={outerTransaction.payed}
                  onValueChange={(ev) =>
                    setOuterTransaction({
                      ...outerTransaction,
                      payed: ev,
                    })
                  }
                >
                  مُستلم
                </Checkbox>
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
