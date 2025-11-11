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
  Link,
  NumberInput,
  Select,
  SelectItem,
  DateInput,
  DatePicker,
  Checkbox,
} from "@heroui/react";
import {
  addInventory,
  deleteInventory,
  getInventory,
  getInventories,
  updateInventory,
} from "../../api";
import {
  FaBox,
  FaLink,
  FaPen,
  FaPenToSquare,
  FaPhone,
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

export function AddInventoryModal({ id, type, onSaveSuccess }) {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inventory, setInventory] = useState({
    name: "",
    quantity: 1,
    statue: false,
    for: "",
    fromdate: today.toISOString().split("T")[0],
    type: type,
    id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(inventory);

    setLoading(true);
    try {
      await addInventory(inventory);
      setInventory({
        ...inventory,
        name: "",
        quantity: 1,
        statue: false,
        for: "",
        fromdate: parseDate("2025-04-04"),
      });
      onSaveSuccess();
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الرقم الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
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

  return (
    <>
      <Tooltip content="إضافة أمانة" color="primary">
        <Button color="primary" isIconOnly onPress={onOpen}>
          <FaPlus />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                إضافة أمانة
              </ModalHeader>
              <ModalBody>
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isRequired
                    label="اسم المادة"
                    type="text"
                    value={inventory.name}
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        name: ev.target.value,
                      })
                    }
                  />
                  <NumberInput
                    isRequired
                    label="العدد"
                    placeholder="ادخل الكمية"
                    showMonthAndYearPickers
                    value={inventory.quantity}
                    minValue={0}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        quantity: ev,
                      })
                    }
                  />

                  <Select
                    aria-hidden="false"
                    label="اختر العملية"
                    isRequired
                    placeholder="اختر"
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        for: ev.target.value,
                      })
                    }
                  >
                    <SelectItem key={"سحب"}>{"سحب"}</SelectItem>
                    <SelectItem key={"اعطاء"}>{"اعطاء"}</SelectItem>
                  </Select>
                  <div className="border h-fit p-3">
                    <label htmlFor="date-input">اختر التاريخ:</label>
                    <input
                      id="date-input"
                      type="date"
                      value={inventory.fromdate}
                      onChange={(ev) =>
                        setInventory({
                          ...inventory,
                          fromdate: ev.target.value,
                        })
                      }
                    />
                  </div>
                  <Checkbox
                    isSelected={inventory.statue}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        statue: ev,
                      })
                    }
                  >
                    مُستلم
                  </Checkbox>
                  <Button color="primary" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حفظ"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateInventoryModal({ id, onSaveSuccess }) {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inventory, setInventory] = useState({
    name: "",
    quantity: 1,
    statue: false,
    type: "",
    fromdate: "",
    id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(inventory);

    setLoading(true);
    try {
      await updateInventory(id, inventory);
      setInventory({
        ...inventory,
        name: "",
        quantity: 1,
        statue: false,
        type: "",
        fromdate: parseDate("2025-04-04"),
      });
      onSaveSuccess();
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت إضافة الرقم الجديد`,
        color: "success",
      });
      setLoading(false); // Axios POST request
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
    getInventory(id)
      .then((response) => {
        setLoading(false);
        setInventory(response.data.inventory); // axios puts data in response.data
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
      <Tooltip content="تعديل أمانة" color="success">
        <Button color="success" isIconOnly onPress={() => handleOpen()}>
          <FaPen />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                إضافة أمانة
              </ModalHeader>
              <ModalBody>
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isRequired
                    label="اسم المادة"
                    type="text"
                    value={inventory.name}
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        name: ev.target.value,
                      })
                    }
                  />
                  <NumberInput
                    isRequired
                    label="العدد"
                    placeholder="ادخل الكمية"
                    showMonthAndYearPickers
                    value={inventory.quantity}
                    minValue={0}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        quantity: ev,
                      })
                    }
                  />

                  <Select
                    aria-hidden="false"
                    label="Select an animal"
                    isRequired
                    placeholder="اختر"
                    selectedKeys={[inventory.type]}
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        type: ev.target.value,
                      })
                    }
                  >
                    <SelectItem key={"سحب"}>{"سحب"}</SelectItem>
                    <SelectItem key={"اعطاء"}>{"اعطاء"}</SelectItem>
                  </Select>
                  <div className="border h-fit p-3">
                    <label htmlFor="date-input">اختر التاريخ:</label>
                    <input
                      id="date-input"
                      type="date"
                      value={inventory.fromdate}
                      onChange={(ev) =>
                        setInventory({
                          ...inventory,
                          fromdate: ev.target.value,
                        })
                      }
                    />
                  </div>
                  <Checkbox
                    isSelected={inventory.statue === "1"}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        statue: ev ? "1" : "0",
                      })
                    }
                  >
                    مُستلم
                  </Checkbox>
                  <Button color="primary" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حفظ"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteInventoryModal({ id, onSaveSuccess }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [inventory, setInventory] = useState({
    name: "",
    quantity: 0,
    statue: false,
    for: "",
    fromdate: "",
    id: id,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteInventory(id);
      onSaveSuccess();
      addToast({
        title: "تمت العملية بنجاح",
        description: `تمت حذف الرقم`,
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
    getInventory(id)
      .then((response) => {
        setLoading(false);
        setInventory(response.data.inventory); // axios puts data in response.data
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
      <Tooltip content="حذف أمانة" color="danger">
        <Button color="danger" isIconOnly onPress={() => handleOpen()}>
          <FaTrashCan />
        </Button>
      </Tooltip>

      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                حذف أمانة
              </ModalHeader>
              <ModalBody>
                <form onSubmit={onSubmit} className="grid grid-rows-3 gap-3">
                  <Input
                    isReadOnly
                    label="اسم المادة"
                    type="text"
                    value={inventory.name}
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        name: ev.target.value,
                      })
                    }
                  />
                  <NumberInput
                    isReadOnly
                    label="العدد"
                    placeholder="ادخل الكمية"
                    showMonthAndYearPickers
                    value={inventory.quantity}
                    minValue={0}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        quantity: ev,
                      })
                    }
                  />

                  <Select
                    aria-hidden="false"
                    label="Select an animal"
                    isDisabled
                    placeholder="اختر"
                    selectedKeys={[inventory.type]}
                    onChange={(ev) =>
                      setInventory({
                        ...inventory,
                        type: ev.target.value,
                      })
                    }
                  >
                    <SelectItem key={"سحب"}>{"سحب"}</SelectItem>
                    <SelectItem key={"اعطاء"}>{"اعطاء"}</SelectItem>
                  </Select>
                  <div className="border h-fit p-3">
                    <label htmlFor="date-input">اختر التاريخ:</label>
                    <input
                      id="date-input"
                      type="date"
                      readOnly
                      value={inventory.fromdate}
                      onChange={(ev) =>
                        setInventory({
                          ...inventory,
                          fromdate: ev.target.value,
                        })
                      }
                    />
                  </div>
                  <Checkbox
                    isSelected={inventory.statue === "1"}
                    onValueChange={(ev) =>
                      setInventory({
                        ...inventory,
                        statue: ev ? "1" : "0",
                      })
                    }
                  >
                    مُستلم
                  </Checkbox>
                  <Button color="danger" type="submit" isLoading={loading}>
                    {loading ? "جاري التحميل ..." : "حذف"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
