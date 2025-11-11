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
  Checkbox,
} from "@heroui/react";
import EyeSlashFilledIcon from "../SVG/EyeSlashFilledIcon";
import EyeFilledIcon from "../SVG/EyeFilledIcon";
import {
  addAdmin,
  addNote,
  deleteAdmin,
  deleteNote,
  getAdmindata,
  getNotedata,
  updateAdmin,
  updateNote,
} from "../../api";
import { FaBox, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

export function AddNoteModal({ userid, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState({
    id: null,
    title: "",
    description: "",
    is_active: "",
    user_id: userid,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addNote(note);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة المدير الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      onSaveSuccess();
      setNote({
        ...note,
        title: "",
        description: "",
        is_active: "",
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
        إضافة ملاحظة جديدة
      </Button>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة ملاحظة جديدة
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-rows-3 gap-4">
                  <Input
                    isRequired
                    label="العنوان"
                    type="text"
                    value={note.title}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        title: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="ملاحظة"
                    type="text"
                    value={note.description}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        description: ev.target.value,
                      })
                    }
                  />
                  <Checkbox
                    isSelected={note.is_active}
                    onValueChange={(ev) =>
                      setNote({
                        ...note,
                        is_active: ev,
                      })
                    }
                  >
                    مُنجز
                  </Checkbox>
                </div>
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

export function UpdateNoteModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [note, setNote] = useState({
    id: null,
    title: "",
    description: "",
    is_active: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateNote(id, note);
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
    getNotedata(id)
      .then((response) => {
        setLoading(false);
        setNote(response.data.note); // axios puts data in response.data
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
      <Tooltip content="تعديل بيانات الملاحظة" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPenToSquare />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الملاحظة
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-rows-3 gap-4">
                  <Input
                    isRequired
                    label="العنوان"
                    type="text"
                    value={note.title}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        title: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isRequired
                    label="ملاحظة"
                    type="text"
                    value={note.description}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        description: ev.target.value,
                      })
                    }
                  />
                  <Checkbox
                    isSelected={note.is_active}
                    onValueChange={(ev) =>
                      setNote({
                        ...note,
                        is_active: ev,
                      })
                    }
                  >
                    مُنجز
                  </Checkbox>
                </div>
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

export function DeleteNoteModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const [note, setNote] = useState({
    id: null,
    title: "",
    description: "",
    user_id: id,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteNote(id);
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
    // Using axios
    getNotedata(id)
      .then((response) => {
        setNote(response.data.note); // axios puts data in response.data
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
      <Tooltip content="حذف الملاحظات" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الملاحظات
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-rows-3 gap-4">
                  <Input
                    isDisabled
                    label="العنوان"
                    type="text"
                    value={note.title}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        title: ev.target.value,
                      })
                    }
                  />
                  <Input
                    isDisabled
                    label="ملاحظة"
                    type="text"
                    value={note.description}
                    onChange={(ev) =>
                      setNote({
                        ...note,
                        description: ev.target.value,
                      })
                    }
                  />
                  <Checkbox
                    isSelected={note.is_active}
                    isDisabled
                    onValueChange={(ev) =>
                      setNote({
                        ...note,
                        is_active: ev,
                      })
                    }
                  >
                    مُنجز
                  </Checkbox>
                </div>
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
