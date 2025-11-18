import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { use, useState } from "react";
import {
  addInvoicesImages,
  deleteInvoiceImage,
  getInvoiceImageById,
} from "../../api";
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";

export function AddInvoiceImageModals({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { invoiceId } = useParams();

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const onSubmit = async (e, onClose) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      await addInvoicesImages(invoiceId, formData);

      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة  وثيقة جديدة`,
        color: "success",
      });

      setImageFile(null);
      onSaveSuccess();
      onClose();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: `عملية برمجية رقم: ${err.message}`,
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Tooltip content="إضافة فاتورة صورة جديد" color="primary">
        <Button color="primary" onPress={onOpen}>
          إضافة وثيقة جديدة
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => onSubmit(e, onClose)}>
              <ModalHeader>إضافة وثيقة جديدة</ModalHeader>

              <ModalBody>
                <Input
                  isRequired
                  type="file"
                  label="الصورة"
                  accept="image/*,.pdf"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit">
                  {submitting ? "جاري التحميل..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteInvoicesImageModals({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    id: null,
    name: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceImageById(id);
      setInvoice(response.data.image);
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
      await deleteInvoiceImage(invoice.id);
      addToast({
        title: "تمت العملية بنجاح",
        description: "تم حذف الفاتورة بنجاح",
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
      <Tooltip content="حذف صورة الفاتورة" color="danger">
        <Button color="danger" isIconOnly onPress={handleOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف صورة الفاتورة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={invoice.name}
                />
                <p className="text-danger text-sm">
                  هل أنت متأكد أنك تريد حذف هذه الفاتورة ؟ هذا الإجراء لا يمكن
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
