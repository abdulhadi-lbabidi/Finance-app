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
  deleteInvoiceItems,
  getInvoiceItemsById,
  updateInvoiceItems,
} from "../../api";

export function UpdateInvoiceItemModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [invoiceItemData, setInvoiceItemData] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    price: "",
    finalprice: "",
    payed: false,
    invoice_id: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceItemsById(id);
      setInvoiceItemData(response.data.invoiceItem);
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
      await updateInvoiceItems(invoiceItemData.id, {
        name: invoiceItemData.name,
        desc: invoiceItemData.desc,
        amount: Number(invoiceItemData.amount),
        price: Number(invoiceItemData.price),
        finalprice: Number(invoiceItemData.finalprice),
        payed: invoiceItemData.payed,
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
      <Tooltip content="تعديل المادة" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل المادة
              </ModalHeader>

              <ModalBody>
                <Input
                  label="الاسم"
                  type="text"
                  isRequired
                  value={invoiceItemData.name}
                  onChange={(e) =>
                    setInvoiceItemData({
                      ...invoiceItemData,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  label="الشرح"
                  type="text"
                  value={invoiceItemData.desc}
                  onChange={(e) =>
                    setInvoiceItemData({
                      ...invoiceItemData,
                      desc: e.target.value,
                    })
                  }
                />

                <Input
                  label="الكمية"
                  type="number"
                  value={invoiceItemData.amount}
                  onChange={(e) =>
                    setInvoiceItemData({
                      ...invoiceItemData,
                      amount: e.target.value,
                    })
                  }
                />

                <Input
                  label="السعر"
                  type="number"
                  value={invoiceItemData.price}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const amount = Number(invoiceItemData.amount);
                    const finalprice = price * amount || 0;

                    setInvoiceItemData({
                      ...invoiceItemData,
                      price,
                      finalprice,
                    });
                  }}
                />
                <Input
                  label="السعر النهائي"
                  isReadOnly
                  value={invoiceItemData.finalprice}
                />

                <Checkbox
                  isSelected={invoiceItemData.payed}
                  onValueChange={(value) =>
                    setInvoiceItemData({ ...invoiceItemData, payed: value })
                  }
                >
                  مدفوع
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

export function DeleteInvoiceItemModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [invoiceItemData, setInvoiceItemData] = useState({
    id: null,
    name: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceItemsById(id);
      setInvoiceItemData(response.data.invoiceItem);
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
      await deleteInvoiceItems(invoiceItemData.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: "تم حذف المادة بنجاح",
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
      <Tooltip content="حذف المادة" color="danger">
        <Button color="danger" isIconOnly onPress={handleOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف المادة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={invoiceItemData.name}
                />
                <p className="text-danger text-sm">
                  هل أنت متأكد أنك تريد حذف المادة هذا الإجراء لا يمكن التراجع
                  عنه.
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
