import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Tooltip,
  Autocomplete,
  AutocompleteItem,
  addToast,
  Checkbox,
} from "@heroui/react";
import { useState } from "react";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  deleteLogicPays,
  getLogicPaysById,
  getLogicTeams,
  updateLogicPays,
  updateTechPays,
} from "../../api";

export function UpdateLogicPaysModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingLogicTeams, setLoadingLogicTeams] = useState(true);
  const [logicTeams, setLogicTeams] = useState([]);

  const [logicPays, setLogicPays] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    price: "",
    finalprice: "",
    workshopname: "",
    payed: false,
    invoice_id: "",
    logistic_team_id: null,
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getLogicPaysById(id);
      setLogicPays(response.data.logicPay);
      getLogicTeams()
        .then((response) => {
          setLogicTeams(response.data.logisticteams); // axios get data in response.data
          setLoadingLogicTeams(false);
        })
        .catch((err) => {
          addToast({
            title: "حدث خطاً",
            description: `عملية برمجية رقم : ${err.message}`,
            color: "danger",
          });
          setLoadingLogicTeams(false);
        });
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
      await updateLogicPays(logicPays.id, {
        name: logicPays.name,
        desc: logicPays.desc,
        amount: Number(logicPays.amount),
        price: Number(logicPays.price),
        finalprice: Number(logicPays.finalprice),
        workshopname: logicPays.workshopname,
        payed: logicPays.payed,
        logistic_team_id: logicPays.logistic_team_id,
      });

      addToast({
        title: "تمت العملية بنجاح",
        description: "تم تعديل المبلغ بنجاح",
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
      <Tooltip content="تعديل المبلغ" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل المبلغ
              </ModalHeader>

              <ModalBody>
                <Input
                  label="الاسم"
                  type="text"
                  isRequired
                  value={logicPays.name}
                  onChange={(e) =>
                    setLogicPays({
                      ...logicPays,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  label="الشرح"
                  type="text"
                  value={logicPays.desc}
                  onChange={(e) =>
                    setLogicPays({
                      ...logicPays,
                      desc: e.target.value,
                    })
                  }
                />

                <Input
                  label="الكمية"
                  type="number"
                  value={logicPays.amount}
                  onChange={(e) =>
                    setLogicPays({
                      ...logicPays,
                      amount: e.target.value,
                    })
                  }
                />

                <Input
                  label="السعر"
                  type="number"
                  value={logicPays.price}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const amount = Number(logicPays.amount);
                    const finalprice = price * amount || 0;

                    setLogicPays({
                      ...logicPays,
                      price,
                      finalprice,
                    });
                  }}
                />

                <Input
                  label="السعر النهائي"
                  isReadOnly
                  value={logicPays.finalprice}
                />

                <Input
                  label="اسم الورشة"
                  value={logicPays.workshopname}
                  onChange={(e) =>
                    setLogicPays({
                      ...logicPays,
                      workshopname: e.target.value,
                    })
                  }
                />

                <Checkbox
                  isSelected={logicPays.payed}
                  onValueChange={(value) =>
                    setLogicPays({ ...logicPays, payed: value })
                  }
                >
                  مدفوع
                </Checkbox>

                <Autocomplete
                  selectedKey={
                    logicPays.logistic_team_id
                      ? logicPays.logistic_team_id.toString()
                      : null
                  }
                  isRequired
                  placeholder={
                    loadingLogicTeams
                      ? "جاري تحميل الحرفي..."
                      : "اختر أحد الحرفيين"
                  }
                  onSelectionChange={(key) =>
                    setLogicPays({
                      ...logicPays,
                      logistic_team_id: key,
                    })
                  }
                >
                  {logicTeams.map((item) => (
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

export function DeleteLogicPaysModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [logicPays, setLogicPays] = useState({
    id: null,
    name: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getLogicPaysById(id);
      setLogicPays(response.data.logicPay);
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
      await deleteLogicPays(logicPays.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: "تم حذف المبلغ بنجاح",
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
      <Tooltip content="حذف المبلغ" color="danger">
        <Button color="danger" isIconOnly onPress={handleOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف المبلغ
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={logicPays.name}
                />
                <p className="text-danger text-sm">
                  هل أنت متأكد أنك تريد حذف هذا المبلغ هذا الإجراء لا يمكن
                  التراجع عنه.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button color="danger" type="submit" isLoading={loading}>
                  {loading ? "جارٍ الحذف..." : "حذف"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
