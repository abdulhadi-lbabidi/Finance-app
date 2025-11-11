import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Divider,
  addToast,
  Tooltip,
  user,
  Spinner,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import {
  addWorkshopLogistic,
  deleteWorkshopLogistic,
  getWorkshopLogistic,
  getWorkshopLogisticInfo,
} from "../../api";
import { FaBox, FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

export function AddWorkshopLogisticModal({ onSaveSuccess, id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [logistics, setLogistics] = useState([]);
  const [workshopLogistic, setWorkshopLogistic] = useState({
    id: null,
    logistic_team_id: null,
    workshop_id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addWorkshopLogistic(workshopLogistic);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setWorkshopLogistic({
        ...workshopLogistic,
        workshop_logistic: null,
        workshop_id: id,
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

  const handleOpen = () => {
    // Using axios
    getWorkshopLogistic(id)
      .then((response) => {
        setLoading(false);
        setLogistics(response.data.logistics); // axios puts data in response.data
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

  const onSelectionChange = (id) => {
    setWorkshopLogistic({
      ...workshopLogistic,
      logistic_team_id: id,
    });
  };

  return (
    <>
      <Button color="primary" onPress={() => handleOpen()}>
        <FaPlus />
      </Button>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة مراقب ورشة جديد
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  allowsCustomValue={true}
                  className="max-w-xs my-5"
                  defaultItems={logistics}
                  label="اختر المراقب"
                  variant="bordered"
                  // onInputChange={onInputChange}
                  onSelectionChange={onSelectionChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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

export function DeleteWorkshopLogisticModal({ id, pivotid, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [workshopLogistic, setWorkshopLogistic] = useState({
    pivotid: pivotid,
    name: "",
    logistic_team_id: id,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteWorkshopLogistic(pivotid);
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
    getWorkshopLogisticInfo(id)
      .then((response) => {
        setLoading(false);
        setWorkshopLogistic(response.data.logistic); // axios puts data in response.data
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
      <Tooltip content="حذف المراقب من الورشة" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف المراقب من الورشة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={workshopLogistic.name}
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
