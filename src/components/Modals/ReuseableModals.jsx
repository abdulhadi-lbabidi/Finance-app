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
  Link,
} from "@heroui/react";
import {
  addPhone,
  deletePhone,
  getPhone,
  getPhones,
  getSocialMedias,
} from "../../api";
import {
  FaBox,
  FaLink,
  FaPenToSquare,
  FaPhone,
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";

export function AddPhoneModal({ id, type, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState({
    number: "",
    name: "",
    type: type,
    id: id,
  });
  const [phones, setPhones] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPhone(phone);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الرقم الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      onSaveSuccess();
      getPhones(type, id)
        .then((response) => {
          setLoading(false);
          setPhones(response.data.phones); // axios puts data in response.data
        })
        .catch((err) => {
          addToast({
            title: "حدث خطاً",
            description: `عملية برمجية رقم : ${err.message}`,
            color: "danger",
          });
          setLoading(false);
        });
      setPhone({
        ...phone,
        name: "",
        number: "",
        type: type,
        id: id,
      });
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
    getPhones(type, id)
      .then((response) => {
        setLoading(false);
        setPhones(response.data.phones); // axios puts data in response.data
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
      <Tooltip content="أرقام الهاتف" color="primary">
        <Button color="primary" isIconOnly onPress={() => handleOpen()}>
          <FaPhone />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                أرقام الهاتف
              </ModalHeader>
              <ModalBody>
                {phones ? (
                  <ol className="ls-dec">
                    {phones.map((item) => (
                      <li key={item.id} className="my-2">
                        <form onSubmit={onSubmit} className="flex">
                          <Link
                            className="w-full"
                            color="foreground"
                            href={"tel:" + item.number}
                          >
                            {item.name}:{item.number}
                          </Link>
                          <Tooltip content="حذف الرقم" color="danger">
                            <Button color="danger" isIconOnly>
                              <FaTrashCan />
                            </Button>
                          </Tooltip>
                        </form>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>Loading data...</p>
                )}

                <Divider />
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isRequired
                    label="التسمية"
                    type="text"
                    value={phone.name}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="الرقم"
                    type="text"
                    value={phone.number}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        number: ev.target.value,
                      })
                    }
                  />
                  <Button color="primary" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حفظ"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function AddPhoneModalWithoutData({ id, type, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [phone, setPhone] = useState({
    number: "",
    name: "",
    type: type,
    id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPhone(phone);
      setPhone({
        ...phone,
        name: "",
        number: "",
      });
      onSaveSuccess();
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الرقم الجديد`,
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
      <Tooltip content="إضافة رقم هاتف" color="primary">
        <Button color="primary" isIconOnly onPress={onOpen}>
          <FaPhone />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                إضافة رقم هاتف
              </ModalHeader>
              <ModalBody>
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isRequired
                    label="التسمية"
                    type="text"
                    value={phone.name}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="الرقم"
                    type="text"
                    value={phone.number}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        number: ev.target.value,
                      })
                    }
                  />
                  <Button color="primary" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حفظ"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeletePhoneModalWithoutData({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [phone, setPhone] = useState({
    number: "",
    name: "",
    id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deletePhone(id);
      onSaveSuccess();
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف الرقم`,
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
    getPhone(id)
      .then((response) => {
        setLoading(false);
        setPhone(response.data.phone); // axios puts data in response.data
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
      <Tooltip content="حذف رقم هاتف" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                حذف رقم هاتف
              </ModalHeader>
              <ModalBody>
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isReadOnly
                    label="التسمية"
                    type="text"
                    value={phone.name}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        name: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isReadOnly
                    label="الرقم"
                    type="text"
                    value={phone.number}
                    onChange={(ev) =>
                      setPhone({
                        ...phone,
                        number: ev.target.value,
                      })
                    }
                  />
                  <Button color="danger" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حذف"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function AddSocialMediaModal({ id, type, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [social, setSocial] = useState({
    number: "",
  });
  const [socials, setSocials] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSocial(social);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الرقم الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      onSaveSuccess();
      setSocial({
        ...social,

        type: type,
        id: id,
      });
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
    getSocialMedias(type, id)
      .then((response) => {
        setLoading(false);
        setSocials(response.data.socials); // axios puts data in response.data
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
      <Tooltip content="روابط التواصل الإجتماعي" color="primary">
        <Button color="primary" isIconOnly onPress={() => handleOpen()}>
          <FaLink />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                روابط التواصل الإجتماعي
              </ModalHeader>
              <ModalBody>
                {socials ? (
                  <ol className="ls-dec">
                    {socials.map((item) => (
                      <li key={item.id} className="my-2">
                        <form onSubmit={onSubmit} className="flex">
                          <Link
                            className="w-full"
                            color="foreground"
                            href={item.url}
                          >
                            {item.url}
                          </Link>
                          <Tooltip content="حذف الرقم" color="danger">
                            <Button color="danger" isIconOnly>
                              <FaTrashCan />
                            </Button>
                          </Tooltip>
                        </form>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>Loading data...</p>
                )}

                <Divider />
                <form onSubmit={onSubmit}>
                  <Input
                    isRequired
                    label="الرابط"
                    type="text"
                    value={social.number}
                    onChange={(ev) =>
                      setSocial({
                        ...social,
                        number: ev.target.value,
                      })
                    }
                  />
                  <Button color="primary" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : <FaPlus />}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
