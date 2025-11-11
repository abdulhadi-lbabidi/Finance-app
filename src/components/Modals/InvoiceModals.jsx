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
} from "@heroui/react";

export function InvoiceModals({ onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="إضافة فاتورة جديد" color="primary">
        <Button color="primary" onPress={onOpen}>
          إضافة فاتورة جديد
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form>
              <ModalHeader className="flex flex-col gap-1">
                إضافة فاتورة جديد
              </ModalHeader>
              <ModalBody>
                <Input isRequired label="الاسم" type="text" />
                <Input isRequired label="الشرح" type="text" />
                <Input isRequired label="المبلغ" type="text" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit">
                  حفظ
                  {/* {loading ? "جاري التحميل ..." : "حفظ"} */}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
