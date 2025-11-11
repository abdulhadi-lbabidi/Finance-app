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
} from "@heroui/react";
import EyeSlashFilledIcon from "../SVG/EyeSlashFilledIcon";
import EyeFilledIcon from "../SVG/EyeFilledIcon";
import {
  addCustomer,
  deleteCustomer,
  getCustomerdata,
  updateCustomer,
} from "../../api";
import { FaBox, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddCustomerModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [customer, setCustomer] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
    user: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCustomer(customer);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الزبون الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setCustomer({
        ...customer,
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
      });
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
        إضافة زبون جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة زبون جديد
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    type="text"
                    value={customer.name}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={customer.phone}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        phone: ev.target.value,
                      })
                    }
                  />

                  <Input
                    isRequired
                    className=" col-span-2"
                    width={"100%"}
                    label="عنوان السكن"
                    type="text"
                    value={customer.address}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        address: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم جديد"
                  type="email"
                  value={customer.email}
                  onChange={(ev) =>
                    setCustomer({
                      ...customer,
                      email: ev.target.value,
                    })
                  }
                />
                <Input
                  isRequired
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  label="كلمة المرور للمستخدم"
                  type={isVisible ? "text" : "password"}
                  value={customer.password}
                  onChange={(ev) =>
                    setCustomer({
                      ...customer,
                      password: ev.target.value,
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

export function UpdateCustomerModal({ id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [customer, setCustomer] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    user: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using axios
    getCustomerdata(id)
      .then((response) => {
        setLoading(false);
        setCustomer(response.data.customer); // axios puts data in response.data
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCustomer({ ...customer, email: customer.user.email });
  }, [customer.user.email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCustomer(customer.id, customer);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تم تعديل الموظف`,
        color: "success",
      });
      setLoading(false); // Axios POST request
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
      <Tooltip content="تعديل بيانات الموظف" color="success">
        <Button color="success" isIconOnly onPress={onOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الموظف
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    type="text"
                    value={customer.name}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={customer.phone}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        phone: ev.target.value,
                      })
                    }
                  />

                  <Input
                    isRequired
                    className="col-span-2"
                    label="عنوان السكن"
                    type="text"
                    value={customer.address}
                    onChange={(ev) =>
                      setCustomer({
                        ...customer,
                        address: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم "
                  type="email"
                  value={customer.email}
                  onChange={(ev) => {
                    setCustomer({
                      ...customer,
                      email: ev.target.value,
                    });
                  }}
                />
                <Input
                  isRequired
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  label="كلمة المرور للمستخدم"
                  type={isVisible ? "text" : "password"}
                  value={customer.password}
                  onChange={(ev) => {
                    setCustomer({
                      ...customer,
                      password: ev.target.value,
                    });
                  }}
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

export function DeleteCustomerModal({ id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [customer, setCustomer] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    user: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using axios
    getCustomerdata(id)
      .then((response) => {
        setCustomer(response.data.customer); // axios puts data in response.data
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
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteCustomer(customer.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تم حذف الزبون`,
        color: "success",
      });
      setLoading(false); // Axios POST request
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

  return (
    <>
      <Tooltip content="حذف زبون" color="danger">
        <Button color="danger" isIconOnly onPress={onOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الزبون وسجلاته
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isDisabled
                    label="الاسم"
                    type="text"
                    value={customer.name}
                  />
                  <Input
                    isDisabled
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={customer.phone}
                  />

                  <Input
                    isDisabled
                    fullWidth
                    className=" col-span-2"
                    label="عنوان السكن"
                    type="text"
                    value={customer.address}
                  />
                </div>
                <Divider />
                <Input
                  isDisabled
                  fullWidth
                  label="إيميل مستخدم "
                  type="email"
                  value={customer.user.email}
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
