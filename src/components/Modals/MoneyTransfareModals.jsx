import React, { useState } from "react";
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
} from "@heroui/react";

import {
  addMoneyTransfare,
  deleteMoneyTransfare,
  getMoneyTransfaredata,
  updateMoneyTransfare,
} from "../../api";
import { FaBox, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddMoneyTransfareModal({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [moneyTransfare, setMoneyTransfare] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMoneyTransfare(moneyTransfare);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة التحويل الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setMoneyTransfare({
        ...moneyTransfare,
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
        إضافة تحويل جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة تحويل جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={moneyTransfare.name}
                  onChange={(ev) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      name: ev.target.value,
                    })
                  }
                />
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

export function UpdateMoneyTransfareModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [moneyTransfare, setMoneyTransfare] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMoneyTransfare(moneyTransfare.id, moneyTransfare);
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
    getMoneyTransfaredata(id)
      .then((response) => {
        setLoading(false);
        setMoneyTransfare(response.data.type); // axios puts data in response.data
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
      <Tooltip content="تعديل بيانات التحويل" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات التحويل
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={moneyTransfare.name}
                  onChange={(ev) =>
                    setMoneyTransfare({
                      ...moneyTransfare,
                      name: ev.target.value,
                    })
                  }
                />
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

export function DeleteMoneyTransfareModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [moneyTransfare, setMoneyTransfare] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteMoneyTransfare(moneyTransfare.id);
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
    getMoneyTransfaredata(id)
      .then((response) => {
        setLoading(false);
        setMoneyTransfare(response.data.type); // axios puts data in response.data
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
      <Tooltip content="حذف نوع المدير" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف نوع المدير
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
