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
  addToast,
  Tooltip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import {
  createTresureFund,
  deleteTresureFund,
  getTresureById,
  getTresureFundById,
  getTresuresByUser,
  updateTresureFund,
} from "../../api";

export function AddTresureFundModal({
  onSaveSuccess,
  id,
  type,
  selectedTresureId,
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const [tresure, setTresure] = useState([]);
  const [loadingTresure, setLoadingTresure] = useState(true);

  const [tresureFund, setTresureFund] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    tresure_id: id,
  });

  const fetchTresure = () => {
    // Using axios
    getTresuresByUser(selectedTresureId, type)
      .then((response) => {
        setTresure(response.data.tresures); // axios get data in response.data
        setLoadingTresure(false);
        console.log(response.data.tresures);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoadingTresure(false);
      });
  };
  useEffect(() => {
    fetchTresure();
  }, [id]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTresureFund({
        ...tresureFund,
        tresure_id: id,
      });
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة  ملحق جديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
      setTresureFund({
        id: null,
        name: "",
        desc: "",
        tresure_id: id,
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
    fetchTresure();
    onOpen();
  };

  return (
    <>
      <Button color="primary" isIconOnly onPress={() => handleOpen()}>
        <FaPlus />
      </Button>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة ملحق جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={tresureFund.name}
                  onChange={(ev) =>
                    setTresureFund({ ...tresureFund, name: ev.target.value })
                  }
                />

                <Input
                  isRequired
                  label="المبلغ"
                  type="number"
                  value={tresureFund.amount}
                  onChange={(e) =>
                    setTresureFund({ ...tresureFund, amount: e.target.value })
                  }
                />

                <Input
                  isRequired
                  label="الوصف"
                  type="text"
                  value={tresureFund.desc}
                  onChange={(ev) =>
                    setTresureFund({ ...tresureFund, desc: ev.target.value })
                  }
                />

                <Autocomplete
                  isRequired
                  placeholder={
                    loadingTresure ? "جاري التحميل..." : "اختر صندوق "
                  }
                  onSelectionChange={(key) =>
                    setTresureFund({ ...tresureFund, tresure_id: key })
                  }
                >
                  {tresure.map((item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
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

export function UpdateTresureFundModal({ id, onSaveSuccess, tresures }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [tresureFund, setTresureFund] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    tresure_id: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getTresureFundById(id);
      setTresureFund(response.data.tresureFund);

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
      await updateTresureFund(tresureFund.id, {
        name: tresureFund.name,
        desc: tresureFund.desc,
        amount: tresureFund.amount,
        tresure_id: tresureFund.tresure_id,
      });

      addToast({
        title: "تمت العملية بنجاح",
        description: "تم تعديل بيانات الملحق بنجاح",
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
      <Tooltip content="تعديل بيانات الملحق" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الملحق
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={tresureFund.name}
                  onChange={(ev) =>
                    setTresureFund({ ...tresureFund, name: ev.target.value })
                  }
                />

                <Input
                  label="القيمة"
                  type="number"
                  value={tresureFund.amount}
                  onChange={(ev) =>
                    setTresureFund({ ...tresureFund, amount: ev.target.value })
                  }
                />
                <Input
                  label="الشرح"
                  type="text"
                  value={tresureFund.desc}
                  onChange={(ev) =>
                    setTresureFund({ ...tresureFund, desc: ev.target.value })
                  }
                />

                <Autocomplete
                  isRequired
                  selectedKey={String(tresureFund.tresure_id)}
                  placeholder="اختر صندوق"
                  onSelectionChange={(key) =>
                    setTresureFund({ ...tresureFund, tresure_id: key })
                  }
                >
                  {tresures.map((item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
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

export function DeleteTresureFundModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [tresureFund, setTresureFund] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteTresureFund(id);
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف الملحق`,
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
        setTresureFund(response.data.tresureFund); // axios puts data in response.data
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
      <Tooltip content="حذف الملحق " color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الملحق{" "}
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={tresureFund.name}
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
