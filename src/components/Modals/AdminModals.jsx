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
import EyeSlashFilledIcon from "../SVG/EyeSlashFilledIcon";
import EyeFilledIcon from "../SVG/EyeFilledIcon";
import {
  addAdmin,
  deleteAdmin,
  getAdmindata,
  getAdminTypes,
  updateAdmin,
} from "../../api";
import { FaBox, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddAdminModal({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [typeItems, setTypeItems] = useState([]);
  const [admin, setAdmin] = useState({
    id: null,
    name: "",
    address: "",
    department: "",
    admintype_id: null,
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
      await addAdmin(admin);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setAdmin({
        ...admin,
        name: "",
        address: "",
        department: "",
        email: "",
        password: "",
        admintype_id: null,
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
    getAdminTypes()
      .then((response) => {
        setLoading(false);
        setTypeItems(response.data.types); // axios puts data in response.data
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
    setAdmin({
      ...admin,
      admintype_id: id,
    });
  };

  return (
    <>
      <Button color="primary" onPress={() => handleOpen()}>
        إضافة مدير جديد
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة مدير جديد
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    type="text"
                    value={admin.name}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="العنوان"
                    type="text"
                    value={admin.address}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        address: ev.target.value,
                      })
                    }
                  />
                  <Autocomplete
                    isRequired
                    defaultItems={typeItems}
                    label="اختر نوع المدير"
                    onSelectionChange={onSelectionChange}
                  >
                    {(typeItem) => (
                      <AutocompleteItem key={typeItem.id}>
                        {typeItem.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <Input
                    isRequired
                    label="القسم او الأختصاص"
                    type="text"
                    value={admin.department}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        department: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم "
                  type="email"
                  value={admin.email}
                  onChange={(ev) =>
                    setAdmin({
                      ...admin,
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
                  value={admin.password}
                  onChange={(ev) =>
                    setAdmin({
                      ...admin,
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

export function UpdateAdminModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [admin, setAdmin] = useState({
    id: null,
    name: "",
    department: "",
    user: {
      email: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdmin(admin.id, admin);
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

  const handleOpen = () => {
    // Using axios
    getAdmindata(id)
      .then((response) => {
        setLoading(false);
        setAdmin(response.data.admin); // axios puts data in response.data
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
        setAdmin({ ...admin, email: admin.user.email });
      });

    onOpen();
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <Tooltip content="تعديل بيانات المدير" color="success">
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
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isRequired
                    label="الاسم"
                    type="text"
                    value={admin.name}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="الحالة الإدارية"
                    type="text"
                    value={admin.admin_level}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        admin_level: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="القسم او الأختصاص"
                    type="text"
                    value={admin.department}
                    onChange={(ev) =>
                      setAdmin({
                        ...admin,
                        department: ev.target.value,
                      })
                    }
                  />
                </div>
                <Divider />
                <Input
                  isRequired
                  label="إيميل مستخدم "
                  type="email"
                  value={admin.user.email}
                  onChange={(ev) =>
                    setAdmin({
                      ...admin.user,
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
                  value={admin.password}
                  onChange={(ev) => {
                    setAdmin({
                      ...admin,
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

export function DeleteAdminModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [admin, setAdmin] = useState({
    id: null,
    name: "",
    address: "",
    admin_level: "",
    department: "",
    email: "",
    password: "",
    user: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteAdmin(admin.id);
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

  const handleOpen = () => {
    getAdmindata(id)
      .then((response) => {
        setAdmin(response.data.admin); // axios puts data in response.data
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

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <Tooltip content="حذف مدير" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف المدير وسجلاته
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    isDisabled
                    label="الاسم"
                    type="text"
                    value={admin.name}
                  />
                  <Input
                    isDisabled
                    label="رقم الهاتف"
                    placeholder="+9639123456789"
                    type="text"
                    value={admin.address}
                  />
                  <Input
                    isDisabled
                    label="الحالة الإدارية"
                    type="text"
                    value={admin.admin_level}
                  />
                  <Input
                    isDisabled
                    label="القسم او الأختصاص"
                    type="text"
                    value={admin.department}
                  />
                </div>
                <Divider />
                <Input
                  isDisabled
                  label="إيميل مستخدم "
                  type="email"
                  value={admin.user.email}
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

// infoo ###########

export function TresureInfoModal({ id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [tresures, setTresures] = useState({
    id: null,
    name: "",
    phone: "",
    admin_level: "",
    department: "",
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
    getAdminTresures(id)
      .then((response) => {
        setAdmin(response.data.admin); // axios puts data in response.data
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
      await deleteAdmin(admin.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف المدير`,
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
      <Tooltip content="حذف مدير" color="danger">
        <Button color="danger" isIconOnly onPress={onOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                صناديق المدير وسجلاته
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="grid grid-cols-4 gap-4"></div>
                <Divider />
                <Input
                  isDisabled
                  label="إيميل مستخدم "
                  type="email"
                  value={admin.user.email}
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
