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
  AutocompleteItem,
  Autocomplete,
} from "@heroui/react";

import {
  addWorkshop,
  deleteWorkshop,
  getCustomers,
  getWorkshopdata,
  updateWorkshop,
} from "../../api";
import { FaBox, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddWorkshopModal({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [workshop, setWorkshop] = useState({
    id: null,
    name: "",
    location: "",
    customer_id: null,
    customer: {
      name: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addWorkshop(workshop);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setWorkshop({
        ...workshop,
        name: "",
        location: "",
        customer_id: null,
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
    getCustomers()
      .then((response) => {
        setLoading(false);
        setCustomers(response.data.customer); // axios puts data in response.data
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
    setWorkshop({
      ...workshop,
      customer_id: id,
    });
  };

  return (
    <>
      <Button color="primary" onPress={() => handleOpen()}>
        إضافة ورشة جديدة
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة ورشة جديدة
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={workshop.name}
                  onChange={(ev) =>
                    setWorkshop({
                      ...workshop,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  isRequired
                  label="العنوان"
                  type="text"
                  value={workshop.location}
                  onChange={(ev) =>
                    setWorkshop({
                      ...workshop,
                      location: ev.target.value,
                    })
                  }
                />
                <Autocomplete
                  isRequired
                  defaultItems={customers}
                  label="اختر مالك المشروع"
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

export function UpdateWorkshopModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [workshop, setWorkshop] = useState({
    id: null,
    name: "",
    location: "",
    customer_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateWorkshop(workshop.id, workshop);
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
    getWorkshopdata(id)
      .then((response) => {
        setLoading(false);
        setWorkshop(response.data.workshop); // axios puts data in response.data
        setCustomers(response.data.customers);
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
    setWorkshop({
      ...workshop,
      customer_id: id,
    });
  };

  return (
    <>
      <Tooltip content="تعديل بيانات الورشة" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الورشة
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={workshop.name}
                  onChange={(ev) =>
                    setWorkshop({
                      ...workshop,
                      name: ev.target.value,
                    })
                  }
                />
                <Input
                  isRequired
                  label="العنوان"
                  type="text"
                  value={workshop.location}
                  onChange={(ev) =>
                    setWorkshop({
                      ...workshop,
                      location: ev.target.value,
                    })
                  }
                />
                <Input
                  isRequired
                  label="العنوان"
                  type="text"
                  value={workshop.customer_id}
                  onChange={(ev) =>
                    setWorkshop({
                      ...workshop,
                      customer_id: ev.target.value,
                    })
                  }
                />
                <Autocomplete
                  id="customer_id"
                  name="customer_id"
                  defaultItems={customers}
                  isRequired
                  label="اختر مالك المشروع"
                  onSelectionChange={onSelectionChange}
                  selectedKey={workshop.customer_id}
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

export function DeleteWorkshopModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [workshop, setWorkshop] = useState({
    id: null,
    name: "",
    location: "",
    customer_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteWorkshop(workshop.id);
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
    getWorkshopdata(id)
      .then((response) => {
        setLoading(false);
        setWorkshop(response.data.workshop); // axios puts data in response.data
        setCustomer(response.data.workshop.customer); // axios puts data in response.data
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
      <Tooltip content="حذف بيانات الورشة" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف بيانات الورشة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={workshop.name}
                />
                <Input
                  isDisabled
                  label="العنوان"
                  type="text"
                  value={workshop.location}
                />
                <Input
                  isDisabled
                  label="المالك"
                  type="text"
                  value={customer.name}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="danger" type="submit" isLoading={loading}>
                  {loading ? "" : "حذف"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
