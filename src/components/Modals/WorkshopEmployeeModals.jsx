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
  addWorkshopEmployee,
  deleteWorkshopEmployee,
  getWorkshopEmployee,
  getWorkshopEmployeeInfo,
} from "../../api";
import { FaBox, FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

export function AddWorkshopEmployeeModal({ onSaveSuccess, id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [workshopEmployee, setWorkshopEmployee] = useState({
    id: null,
    employee_id: null,
    workshop_id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addWorkshopEmployee(workshopEmployee);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setWorkshopEmployee({
        ...workshopEmployee,
        workshop_employee: null,
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
    getWorkshopEmployee(id)
      .then((response) => {
        setLoading(false);
        setEmployees(response.data.employees); // axios puts data in response.data
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
    setWorkshopEmployee({
      ...workshopEmployee,
      employee_id: id,
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
                إضافة موظف ورشة جديد
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  allowsCustomValue={true}
                  className="max-w-xs my-5"
                  defaultItems={employees}
                  label="اختر الموظف"
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

export function DeleteWorkshopEmployeeModal({ id, pivotid, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [workshopEmployee, setWorkshopEmployee] = useState({
    pivotid: pivotid,
    name: "",
    employee_id: id,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteWorkshopEmployee(pivotid);
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
    getWorkshopEmployeeInfo(id)
      .then((response) => {
        setLoading(false);
        setWorkshopEmployee(response.data.employee); // axios puts data in response.data
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
      <Tooltip content="حذف الموظف من الورشة" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الموظف من الورشة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={workshopEmployee.name}
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
