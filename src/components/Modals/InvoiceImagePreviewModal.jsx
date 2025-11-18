import { Modal, ModalContent, Button, useDisclosure } from "@heroui/react";
import VisibilityIcon from "../SVG/VisibilityIcon";

export function InvoiceImagePreviewModal({ imageUrl }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        variant="faded"
        color="primary"
        onPress={onOpen}
        aria-label="عرض الصورة"
      >
        <VisibilityIcon />
      </Button>

      <Modal isOpen={isOpen} size="full" onClose={onClose}>
        <ModalContent
          classNames={{ body: "p-0 flex justify-center items-center" }}
        >
          <img
            src={imageUrl}
            alt="invoice"
            className="max-h-full max-w-full object-contain"
          />
        </ModalContent>
      </Modal>
    </>
  );
}
