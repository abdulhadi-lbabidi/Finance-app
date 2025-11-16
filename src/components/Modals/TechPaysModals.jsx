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
import { useEffect, useState } from "react";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  deleteTechPays,
  getTechPaysById,
  getTechnicalTeams,
  updateTechPays,
} from "../../api";

export function UpdateTechPaysModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [loadingTechnicalTeams, setLoadingTechnicalTeams] = useState(true);
  const [technicalTeams, setTechnicalTeams] = useState([]);

  const [technicalPays, setTechnicalPays] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    price: "",
    finalprice: "",
    workshopname: "",
    payed: false,
    invoice_id: "",
    technical_team_id: null,
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getTechPaysById(id);
      setTechnicalPays(response.data.techPay);
      getTechnicalTeams()
        .then((response) => {
          setTechnicalTeams(response.data.technicalteam); // axios get data in response.data
          setLoadingTechnicalTeams(false);
        })
        .catch((err) => {
          addToast({
            title: "حدث خطاً",
            description: `عملية برمجية رقم : ${err.message}`,
            color: "danger",
          });
          setLoadingTechnicalTeams(false);
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
      await updateTechPays(technicalPays.id, {
        name: technicalPays.name,
        desc: technicalPays.desc,
        amount: Number(technicalPays.amount),
        price: Number(technicalPays.price),
        finalprice: Number(technicalPays.finalprice),
        workshopname: technicalPays.workshopname,
        payed: technicalPays.payed,
        technical_team_id: technicalPays.technical_team_id,
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
                  value={technicalPays.name}
                  onChange={(e) =>
                    setTechnicalPays({
                      ...technicalPays,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  label="الشرح"
                  type="text"
                  value={technicalPays.desc}
                  onChange={(e) =>
                    setTechnicalPays({
                      ...technicalPays,
                      desc: e.target.value,
                    })
                  }
                />

                <Input
                  label="الكمية"
                  type="number"
                  value={technicalPays.amount}
                  onChange={(e) =>
                    setTechnicalPays({
                      ...technicalPays,
                      amount: e.target.value,
                    })
                  }
                />

                <Input
                  label="السعر"
                  type="number"
                  value={technicalPays.price}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const amount = Number(technicalPays.amount);
                    const finalprice = price * amount || 0;

                    setTechnicalPays({
                      ...technicalPays,
                      price,
                      finalprice,
                    });
                  }}
                />

                <Input
                  label="السعر النهائي"
                  isReadOnly
                  value={technicalPays.finalprice}
                />

                <Input
                  label="اسم الورشة"
                  value={technicalPays.workshopname}
                  onChange={(e) =>
                    setTechnicalPays({
                      ...technicalPays,
                      workshopname: e.target.value,
                    })
                  }
                />

                <Checkbox
                  isSelected={technicalPays.payed}
                  onValueChange={(value) =>
                    setTechnicalPays({ ...technicalPays, payed: value })
                  }
                >
                  مدفوع
                </Checkbox>

                <Autocomplete
                  selectedKey={
                    technicalPays.technical_team_id
                      ? technicalPays.technical_team_id.toString()
                      : null
                  }
                  isRequired
                  placeholder={
                    loadingTechnicalTeams
                      ? "جاري تحميل الحرفي..."
                      : "اختر أحد الحرفيين"
                  }
                  onSelectionChange={(key) =>
                    setTechnicalPays({
                      ...technicalPays,
                      technical_team_id: key,
                    })
                  }
                >
                  {technicalTeams.map((item) => (
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

export function DeleteTechPaysModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [techPays, setTechPays] = useState({
    id: null,
    name: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getTechPaysById(id);
      setTechPays(response.data.techPay);
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
      await deleteTechPays(techPays.id);
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
                  value={techPays.name}
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
