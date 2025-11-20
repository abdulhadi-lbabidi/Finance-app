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
  addInnerTransaction,
  deleteInnerTransaction,
  getInnerTransactiondata,
  updateInnerTransaction,
} from "../../api";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddInnerTransactionModal({ onSaveSuccess, tresurefundid }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const today = new Date();

  const [innerTransaction, setInnerTransaction] = useState({
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
      await addInnerTransaction(innerTransaction);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setInnerTransaction({
        ...innerTransaction,
        name: "",
      });
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

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        إضافة إيراد جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة إيراد جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={innerTransaction.name}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  label="ملاحظات"
                  type="text"
                  value={innerTransaction.desc}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      desc: ev.target.value,
                    })
                  }
                />
                <div className="border h-fit p-3">
                  <label htmlFor="date-input">اختر التاريخ:</label>
                  <input
                    id="date-input"
                    type="date"
                    value={innerTransaction.indate}
                    onChange={(ev) =>
                      setInnerTransaction({
                        ...innerTransaction,
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
                  value={innerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isSelected={innerTransaction.payed}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
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

export function UpdateInnerTransactionModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [innerTransaction, setInnerTransaction] = useState({
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
      await updateInnerTransaction(innerTransaction.id, innerTransaction);
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
    getInnerTransactiondata(id)
      .then((response) => {
        setLoading(false);
        setInnerTransaction(response.data.InnerTransaction); // axios puts data in response.data
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
      <Tooltip content="تعديل بيانات الإيراد" color="success">
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
                  value={innerTransaction.name}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  label="ملاحظات"
                  type="text"
                  value={innerTransaction.desc}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      desc: ev.target.value,
                    })
                  }
                />
                <div className="border h-fit p-3">
                  <label htmlFor="date-input">اختر التاريخ:</label>
                  <input
                    id="date-input"
                    type="date"
                    value={innerTransaction.indate}
                    onChange={(ev) =>
                      setInnerTransaction({
                        ...innerTransaction,
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
                  value={innerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isSelected={innerTransaction.payed}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
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

export function DeleteInnerTransactionModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [innerTransaction, setInnerTransaction] = useState({
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
      await deleteInnerTransaction(innerTransaction.id);
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
    getInnerTransactiondata(id)
      .then((response) => {
        setLoading(false);
        setInnerTransaction(response.data.InnerTransaction); // axios puts data in response.data
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
      <Tooltip content="حذف الإيراد" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الإيراد
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={innerTransaction.name}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  isDisabled
                  label="ملاحظات"
                  type="text"
                  value={innerTransaction.desc}
                  onChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
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
                    value={innerTransaction.indate}
                    onChange={(ev) =>
                      setInnerTransaction({
                        ...innerTransaction,
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
                  value={innerTransaction.amount}
                  minValue={0}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
                      amount: ev,
                    })
                  }
                />
                <Checkbox
                  isDisabled
                  isSelected={innerTransaction.payed}
                  onValueChange={(ev) =>
                    setInnerTransaction({
                      ...innerTransaction,
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
