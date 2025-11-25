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
  SelectItem,
  Select,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  addInvoices,
  deleteInvoices,
  getFinanceItems,
  getInvoiceById,
  updateInvoices,
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import EyeFilledIcon from "../SVG/EyeFilledIcon";
import { AddFinanceItemModal } from "./FinanceItemModals";

export function AddInvoiceModals({ onSaveSuccess }) {
  const { id, transactionId, type } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [financeItems, setFinanceItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [invoices, setInvoices] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    finance_item_id: null,
    invoiceable_id: transactionId,
    invoiceable_type:
      type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
  });

  const fetchDataItems = () => {
    // Using axios
    getFinanceItems()
      .then((response) => {
        setFinanceItems(response.data.items); // axios get data in response.data
        setLoadingItems(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoadingItems(false);
      });
  };

  const onSubmit = async (e, onClose) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // await addInvoices(invoices);
      const response = await addInvoices(invoices);
      const invoiceId = response.data.invoice.id;
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة فاتورة جديدة`,
        color: "success",
      });
      setSubmitting(false); // Axios POST request
      setInvoices({
        id: null,
        name: "",
        desc: "",
        amount: "",
        finance_item_id: null,
        invoiceable_id: transactionId,
        invoiceable_type:
          type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
      });

      // onSaveSuccess();
      onClose();

      // go to the invoices info
      navigate(
        `/tresure/admin/${id}/invoices/${transactionId}/${type}/info/${invoiceId}`
      );
    } catch (err) {
      addToast({
        title: "حدث خطاً",
        description: `عملية برمجية رقم : ${err.message}`,
        color: "danger",
      });
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const amount = parseFloat(invoices.amount) || 0;
    const discountValue = parseFloat(invoices.discount_value) || 0;
    const discountType = invoices.discount_type;

    let finalPrice = amount;

    if (discountType === "نسبة") {
      finalPrice = amount - amount * (discountValue / 100);
    } else {
      finalPrice = amount - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    setInvoices((prev) => ({
      ...prev,
      final_price: finalPrice,
    }));
  }, [invoices.amount, invoices.discount_value, invoices.discount_type]);

  useEffect(() => {
    fetchDataItems();
  }, []);

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
            <form onSubmit={(e) => onSubmit(e, onClose)}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة فاتورة جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={invoices.name}
                  onChange={(e) =>
                    setInvoices({ ...invoices, name: e.target.value })
                  }
                />
                <Input
                  label="الشرح"
                  type="text"
                  value={invoices.desc}
                  onChange={(e) =>
                    setInvoices({ ...invoices, desc: e.target.value })
                  }
                />
                <Input
                  isRequired
                  label="المبلغ"
                  type="number"
                  value={invoices.amount}
                  onChange={(e) =>
                    setInvoices({ ...invoices, amount: e.target.value })
                  }
                />

                <Autocomplete
                  isRequired
                  placeholder={
                    loadingItems ? "جاري التحميل..." : "اختر بند الفاتورة"
                  }
                  onSelectionChange={(key) =>
                    setInvoices({ ...invoices, finance_item_id: key })
                  }
                >
                  {financeItems.map((item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <AddFinanceItemModal onSaveSuccess={fetchDataItems} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button color="primary" type="submit">
                  {submitting ? "جاري التحميل ..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateInvoicesModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { transactionId, type } = useParams();
  const [financeItems, setFinanceItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [invoices, setInvoices] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    finance_item_id: "",
    invoiceable_id: transactionId,
    invoiceable_type:
      type === "innerTransaction" ? "innerTransaction" : "outerTransaction",

    final_price: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceById(id);
      setInvoices(response.data.invoice);

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
      await updateInvoices(invoices.id, {
        name: invoices.name,
        desc: invoices.desc,
        amount: invoices.amount,
        finance_item_id: invoices.finance_item_id,
        invoiceable_id: invoices.invoiceable_id,
        invoiceable_type:
          type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
      });

      addToast({
        title: "تمت العملية بنجاح",
        description: "تم تعديل بيانات الفاتورة بنجاح",
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

  useEffect(() => {
    getFinanceItems()
      .then((res) => {
        setFinanceItems(res.data.items);
        setLoadingItems(false);
      })
      .catch((err) => {
        addToast({
          title: "خطأ",
          description: err.message,
          color: "danger",
        });
        setLoadingItems(false);
      });
  }, []);

  useEffect(() => {
    const amount = parseFloat(invoices.amount) || 0;
    const discountValue = parseFloat(invoices.discount_value) || 0;
    const discountType = invoices.discount_type;

    let finalPrice = amount;

    if (discountType === "نسبة") {
      finalPrice = amount - amount * (discountValue / 100);
    } else {
      finalPrice = amount - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    setInvoices((prev) => ({
      ...prev,
      final_price: finalPrice,
    }));
  }, [invoices.amount, invoices.discount_value, invoices.discount_type]);

  return (
    <>
      <Tooltip content="تعديل بيانات الفاتورة" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الفاتورة
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={invoices.name}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, name: ev.target.value })
                  }
                />
                <Input
                  label="الشرح"
                  type="text"
                  value={invoices.desc}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, desc: ev.target.value })
                  }
                />
                <Input
                  label="القيمة"
                  type="number"
                  value={invoices.amount}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, amount: ev.target.value })
                  }
                />

                <Input
                  isReadOnly
                  label="السعر النهائي"
                  value={invoices.final_price}
                />

                <Autocomplete
                  isRequired
                  selectedKey={invoices.finance_item_id?.toString()}
                  placeholder={
                    loadingItems ? "جاري تحميل البنود..." : "اختر بند الفاتورة"
                  }
                  onSelectionChange={(key) =>
                    setInvoices({ ...invoices, finance_item_id: key })
                  }
                >
                  {financeItems.map((item) => (
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

export function DeleteInvoicesModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    id: null,
    name: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceById(id);
      setInvoice(response.data.invoice);
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
      await deleteInvoices(invoice.id);
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
      <Tooltip content="حذف الفاتورة" color="danger">
        <Button color="danger" isIconOnly onPress={handleOpen}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                حذف الفاتورة
              </ModalHeader>
              <ModalBody>
                <Input
                  isDisabled
                  label="الاسم"
                  type="text"
                  value={invoice.name}
                />
                <p className="text-danger text-sm">
                  هل أنت متأكد أنك تريد حذف هذه الفاتورة؟ هذا الإجراء لا يمكن
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

export function AddInvoiceWithDiscountModals({ onSaveSuccess }) {
  const { id, transactionId, type } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [financeItems, setFinanceItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invoices, setInvoices] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    finance_item_id: null,
    invoiceable_id: transactionId,
    invoiceable_type:
      type === "innerTransaction" ? "innerTransaction" : "outerTransaction",

    discount_value: "",
    discount_type: "قيمة", // قيمة | نسبة

    final_price: 0,
  });

  const fetchDataItems = () => {
    // Using axios
    getFinanceItems()
      .then((response) => {
        setFinanceItems(response.data.items); // axios get data in response.data
        setLoadingItems(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoadingItems(false);
      });
  };

  const onSubmit = async (e, onClose) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // await addInvoices(invoices);
      const response = await addInvoices(invoices);
      const invoiceId = response.data.invoice.id;
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة فاتورة جديدة`,
        color: "success",
      });
      setSubmitting(false); // Axios POST request
      setInvoices({
        id: null,
        name: "",
        desc: "",
        amount: "",
        finance_item_id: null,
        invoiceable_id: transactionId,
        invoiceable_type:
          type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
        discount_value: "",
        discount_type: "قيمة",
        final_price: 0,
      });

      // onSaveSuccess();
      onClose();

      // go to the invoices info
      navigate(
        `/tresure/admin/${id}/invoices/${transactionId}/${type}/info/${invoiceId}`
      );
    } catch (err) {
      addToast({
        title: "حدث خطاً",
        description: `عملية برمجية رقم : ${err.message}`,
        color: "danger",
      });
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const amount = parseFloat(invoices.amount) || 0;
    const discountValue = parseFloat(invoices.discount_value) || 0;
    const discountType = invoices.discount_type;

    let finalPrice = amount;

    if (discountType === "نسبة") {
      finalPrice = amount - amount * (discountValue / 100);
    } else {
      finalPrice = amount - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    setInvoices((prev) => ({
      ...prev,
      final_price: finalPrice,
    }));
  }, [invoices.amount, invoices.discount_value, invoices.discount_type]);

  useEffect(() => {
    fetchDataItems();
  }, []);

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
            <form onSubmit={(e) => onSubmit(e, onClose)}>
              <ModalHeader className="flex flex-col gap-1">
                إضافة فاتورة جديد
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={invoices.name}
                  onChange={(e) =>
                    setInvoices({ ...invoices, name: e.target.value })
                  }
                />

                <Input
                  isRequired
                  label="الشرح"
                  type="text"
                  value={invoices.desc}
                  onChange={(e) =>
                    setInvoices({ ...invoices, desc: e.target.value })
                  }
                />

                <Input
                  isRequired
                  label="المبلغ"
                  type="number"
                  value={invoices.amount}
                  onChange={(e) =>
                    setInvoices({ ...invoices, amount: e.target.value })
                  }
                />

                <Input
                  label="قيمة الخصم"
                  type="number"
                  value={invoices.discount_value}
                  onChange={(e) =>
                    setInvoices({ ...invoices, discount_value: e.target.value })
                  }
                />

                <Select
                  label="نوع الخصم"
                  placeholder="اختر نوع الخصم"
                  selectedKeys={
                    invoices.discount_type ? [invoices.discount_type] : []
                  }
                  onChange={(e) =>
                    setInvoices({ ...invoices, discount_type: e.target.value })
                  }
                >
                  <SelectItem key="قيمة" value="قيمة">
                    قيمة (خصم ثابت)
                  </SelectItem>
                  <SelectItem key="نسبة" value="نسبة">
                    نسبة (٪)
                  </SelectItem>
                </Select>

                <Input
                  isReadOnly
                  label="السعر النهائي"
                  value={invoices.final_price}
                />

                <Autocomplete
                  isRequired
                  placeholder={
                    loadingItems ? "جاري التحميل..." : "اختر بند الفاتورة"
                  }
                  onSelectionChange={(key) =>
                    setInvoices({ ...invoices, finance_item_id: key })
                  }
                >
                  {financeItems.map((item) => (
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
                <Button color="primary" type="submit">
                  {submitting ? "جاري التحميل ..." : "حفظ"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateInvoicesWithDiscountModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { transactionId, type } = useParams();
  const [financeItems, setFinanceItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [invoices, setInvoices] = useState({
    id: null,
    name: "",
    desc: "",
    amount: "",
    finance_item_id: "",
    invoiceable_id: transactionId,
    invoiceable_type:
      type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
    discount_value: "",
    discount_type: "قيمة",
    final_price: "",
  });

  const handleOpen = async () => {
    setLoading(true);
    try {
      const response = await getInvoiceById(id);
      setInvoices(response.data.invoice);
      getFinanceItems()
        .then((response) => {
          setFinanceItems(response.data.items); // axios get data in response.data
          setLoadingItems(false);
        })
        .catch((err) => {
          addToast({
            title: "حدث خطاً",
            description: `عملية برمجية رقم : ${err.message}`,
            color: "danger",
          });
          setLoadingItems(false);
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
      await updateInvoices(invoices.id, {
        name: invoices.name,
        desc: invoices.desc,
        amount: invoices.amount,
        finance_item_id: invoices.finance_item_id,
        invoiceable_id: invoices.invoiceable_id,
        invoiceable_type:
          type === "innerTransaction" ? "innerTransaction" : "outerTransaction",
        discount_value: invoices.discount_value,
        discount_type: invoices.discount_type,
      });

      addToast({
        title: "تمت العملية بنجاح",
        description: "تم تعديل بيانات الفاتورة بنجاح",
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

  useEffect(() => {
    const amount = parseFloat(invoices.amount) || 0;
    const discountValue = parseFloat(invoices.discount_value) || 0;
    const discountType = invoices.discount_type;

    let finalPrice = amount;

    if (discountType === "نسبة") {
      finalPrice = amount - amount * (discountValue / 100);
    } else {
      finalPrice = amount - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    setInvoices((prev) => ({
      ...prev,
      final_price: finalPrice,
    }));
  }, [invoices.amount, invoices.discount_value, invoices.discount_type]);

  return (
    <>
      <Tooltip content="تعديل بيانات الفاتورة" color="success">
        <Button color="success" isIconOnly onPress={handleOpen}>
          <FaPenToSquare />
        </Button>
      </Tooltip>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                تعديل بيانات الفاتورة
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="الاسم"
                  type="text"
                  value={invoices.name}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, name: ev.target.value })
                  }
                />
                <Input
                  label="الشرح"
                  type="text"
                  value={invoices.desc}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, desc: ev.target.value })
                  }
                />
                <Input
                  label="القيمة"
                  type="number"
                  value={invoices.amount}
                  onChange={(ev) =>
                    setInvoices({ ...invoices, amount: ev.target.value })
                  }
                />

                <Input
                  label="قيمة الخصم"
                  type="number"
                  value={invoices.discount_value}
                  onChange={(ev) =>
                    setInvoices({
                      ...invoices,
                      discount_value: ev.target.value,
                    })
                  }
                />

                <Select
                  label="نوع الخصم"
                  placeholder="اختر نوع الخصم"
                  selectedKeys={
                    invoices.discount_type ? [invoices.discount_type] : []
                  }
                  onChange={(e) =>
                    setInvoices({ ...invoices, discount_type: e.target.value })
                  }
                >
                  <SelectItem key="قيمة" value="قيمة">
                    قيمة (خصم ثابت)
                  </SelectItem>
                  <SelectItem key="نسبة" value="نسبة">
                    نسبة (٪)
                  </SelectItem>
                </Select>

                <Input
                  isReadOnly
                  label="السعر النهائي"
                  value={invoices.final_price}
                />

                <Autocomplete
                  isRequired
                  selectedKey={invoices.finance_item_id?.toString()}
                  placeholder={
                    loadingItems ? "جاري تحميل البنود..." : "اختر بند الفاتورة"
                  }
                  onSelectionChange={(key) =>
                    setInvoices({ ...invoices, finance_item_id: key })
                  }
                >
                  {financeItems.map((item) => (
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
