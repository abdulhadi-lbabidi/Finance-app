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
  Divider,
  addToast,
  Tooltip,
  Spinner,
} from "@heroui/react";
import EyeSlashFilledIcon from "../SVG/EyeSlashFilledIcon";
import EyeFilledIcon from "../SVG/EyeFilledIcon";
import {
  addLogistic,
  deleteLogistic,
  getLogisticdata,
  updateLogistic,
} from "../../api";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddLogisticModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [logistic, setLogistic] = useState({
    id: null,
    name: "",
    phone: "",
    desc: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLogistic(logistic);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الفريق الحرفي الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setLogistic({
        ...logistic,
        name: "",
        phone: "",
        desc: "",
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
        إضافة موظف جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة موظف جديد
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    type="text"
                    value={logistic.name}
                    onChange={(ev) =>
                      setLogistic({
                        ...logistic,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={logistic.phone}
                    onChange={(ev) =>
                      setLogistic({
                        ...logistic,
                        phone: ev.target.value,
                      })
                    }
                  />

                  <Input
                    isRequired
                    className="col-span-2"
                    label="عنوان السكن"
                    type="text"
                    value={logistic.desc}
                    onChange={(ev) =>
                      setLogistic({
                        ...logistic,
                        desc: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم "
                  type="email"
                  value={logistic.email}
                  onChange={(ev) =>
                    setLogistic({
                      ...logistic,
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
                  value={logistic.password}
                  onChange={(ev) =>
                    setLogistic({
                      ...logistic,
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

export function UpdateLogisticModal({ id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [logistic, setLogistic] = useState({
    id: null,
    name: "",
    phone: "",
    desc: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using axios
    getLogisticdata(id)
      .then((response) => {
        setLoading(false);
        setLogistic(response.data.logistic); // axios puts data in response.data
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
      await updateLogistic(employee.id, employee);
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
                    value={employee.name}
                    onChange={(ev) =>
                      setLogistic({
                        ...employee,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={employee.phone}
                    onChange={(ev) =>
                      setLogistic({
                        ...employee,
                        phone: ev.target.value,
                      })
                    }
                  />

                  <Input
                    isRequired
                    className="col-span-2"
                    label="عنوان السكن"
                    type="text"
                    value={employee.desc}
                    onChange={(ev) =>
                      setLogistic({
                        ...employee,
                        desc: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم "
                  type="email"
                  value={employee.email}
                  onChange={(ev) => {
                    setLogistic({
                      ...employee,
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
                  value={employee.password}
                  onChange={(ev) => {
                    setLogistic({
                      ...employee,
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

export function DeleteLogisticModal({ id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [employee, setLogistic] = useState({
    id: null,
    name: "",
    phone: "",
    desc: "",
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
    getLogisticdata(id)
      .then((response) => {
        setLogistic(response.data.employee); // axios puts data in response.data
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
      await deleteLogistic(employee.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تم حذف الموظف`,
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
      <Tooltip content="حذف موظف" color="danger">
        <Button color="danger" isIconOnly onPress={onOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الموظف وسجلاته
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isDisabled
                    label="الاسم"
                    type="text"
                    value={employee.name}
                  />
                  <Input
                    isDisabled
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={employee.phone}
                  />

                  <Input
                    isDisabled
                    fullWidth
                    className=" col-span-2"
                    label="عنوان السكن"
                    type="text"
                    value={employee.desc}
                  />
                </div>
                <Divider />
                <Input
                  isDisabled
                  fullWidth
                  label="إيميل مستخدم "
                  type="email"
                  value={employee.user.email}
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
