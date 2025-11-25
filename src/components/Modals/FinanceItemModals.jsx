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
} from "@heroui/react";

import {
  addFinanceItem,
  deleteFinanceItem,
  getFinanceItemdata,
  updateFinanceItem,
} from "../../api";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddFinanceItemModal({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [financeItem, setFinanceItem] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await addFinanceItem(financeItem);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة البند الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setFinanceItem({
        ...financeItem,
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
        إضافة بند جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة بند جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={financeItem.name}
                  onChange={(ev) =>
                    setFinanceItem({
                      ...financeItem,
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

export function UpdateFinanceItemModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [financeItem, setFinanceItem] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFinanceItem(financeItem.id, financeItem);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت تعديل البند`,
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
    getFinanceItemdata(id)
      .then((response) => {
        setLoading(false);
        setFinanceItem(response.data.item); // axios puts data in response.data
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
      <Tooltip content="تعديل بيانات البند" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات بند
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={financeItem.name}
                  onChange={(ev) =>
                    setFinanceItem({
                      ...financeItem,
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

export function DeleteFinanceItemModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [financeItem, setFinanceItem] = useState({
    id: null,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteFinanceItem(financeItem.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف البند`,
        color: "success",
      });
      setLoading(false); // Axios POST request\
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
    getFinanceItemdata(id)
      .then((response) => {
        setFinanceItem(response.data.item); // axios puts data in response.data
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
    onOpen();
  };
  return (
    <>
      <Tooltip content="حذف  البند" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف البند
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={financeItem.name}
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
