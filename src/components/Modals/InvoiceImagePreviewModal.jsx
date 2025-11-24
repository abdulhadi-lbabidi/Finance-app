import { Modal, ModalContent, Button, useDisclosure } from "@heroui/react";
import VisibilityIcon from "../SVG/VisibilityIcon";

export function InvoiceImagePreviewModal({ imageUrl }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isPdf = imageUrl.toLowerCase().endsWith(".pdf");

  const handleOpen = () => {
    if (isPdf) {
      window.open(imageUrl, "_blank");
    } else {
      onOpen();
    }
  };

  return (
    <>
      <Button
        isIconOnly
        variant="faded"
        color="primary"
        onPress={handleOpen}
        aria-label="عرض الصورة"
      >
        <VisibilityIcon />
      </Button>

      {/* المودال فقط للصور */}
      {!isPdf && (
        <Modal isOpen={isOpen} size="full" onClose={onClose}>
          <ModalContent className="p-0 flex justify-center items-center">
            <img
              src={imageUrl}
              alt="invoice"
              className="max-h-full max-w-full object-contain"
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
