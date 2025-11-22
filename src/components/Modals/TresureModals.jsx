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
  Checkbox,
} from "@heroui/react";

import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import {
  createTresure,
  deleteTresure,
  getTresureById,
  updateTresure,
} from "../../api";

export function AddTresureModal({ onSaveSuccess, id, type }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [tresure, setTresure] = useState({
    id: null,
    name: "",
    active: false,
    tresureable_id: id,
    tresureable_type: type,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTresure({
        ...tresure,
        tresureable_id: id,
        tresureable_type: type,
      });
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة  صندوق جديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setTresure({
        id: null,
        name: "",
        active: false,
        tresureable_id: id,
        tresureable_type: type,
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

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <Button
        color="primary"
        className="mr-1"
        isIconOnly
        onPress={() => handleOpen()}
      >
        <FaPlus />
      </Button>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة صندوق جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={tresure.name}
                  onChange={(ev) =>
                    setTresure({ ...tresure, name: ev.target.value })
                  }
                />

                <Checkbox
                  isSelected={tresure.active}
                  onValueChange={(ev) =>
                    setTresure({
                      ...tresure,
                      active: ev,
                    })
                  }
                >
                  تفعيل
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

export function UpdateTresureModal({ id, onSaveSuccess, tresureable_id }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const [tresure, setTresure] = useState({
    id: null,
    name: "",
    active: "",
    tresureable_id: tresureable_id,
    tresureable_type: "admin",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getTresureById(id);
      setTresure(response.data.tresure);

      onOpen();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: `عملية برمجية رقم: ${err.message}`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateTresure(tresure.id, {
        name: tresure.name,
        active: tresure.active,
        tresureable_id: tresureable_id,
        tresureable_type: "admin",
      });

      addToast({
        title: "تمت العملية بنجاح",
        description: "تم تعديل بيانات الصندوق بنجاح",
        color: "success",
      });
      onSaveSuccess();
      onClose();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: `عملية برمجية رقم: ${err.message}`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip content="تعديل بيانات الصندوق" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الصندوق
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={tresure.name}
                  onChange={(ev) =>
                    setTresure({ ...tresure, name: ev.target.value })
                  }
                />

                <Checkbox
                  isSelected={tresure.active}
                  value={tresure.active}
                  onValueChange={(ev) =>
                    setTresure({
                      ...tresure,
                      active: ev,
                    })
                  }
                >
                  تفعيل
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  حفظ
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteTresureModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [Tresure, setTresure] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteTresure(id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف الصندوق`,
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
    getTresureById(id)
      .then((response) => {
        setLoading(false);
        setTresure(response.data.tresure); // axios puts data in response.data
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
      <Tooltip content="حذف الصندوق " color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الصندوق{" "}
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={Tresure.name}
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
