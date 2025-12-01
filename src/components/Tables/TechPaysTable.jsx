import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { addTechPays, getTechnicalTeams, getTechPays } from "../../api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from "../SVG/SearchIcon";
import ChevronDownIcon from "../SVG/ChevronDownIcon";

import {
  DeleteTechPaysModal,
  UpdateTechPaysModal,
} from "../Modals/TechPaysModals";
import PrintIcon from "../SVG/PrintIcon";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "الاسم", uid: "name", sortable: true },
  { name: "الشرح", uid: "desc", sortable: true },
  { name: "مدفوعة", uid: "payed", sortable: true },
  { name: "القيمة", uid: "amount", sortable: true },
  { name: "السعر", uid: "price", sortable: true },
  { name: "الخصم", uid: "discount_value", sortable: true },
  { name: "نوع الخصم", uid: "discount_type", sortable: true },
  { name: "الحرفي", uid: "technical_team_id", sortable: true },
  { name: "السعر النهائي", uid: "finalprice", sortable: true },
  { name: "عمليات", uid: "actions" },
];
const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];
const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "payed",
  "actions",
  "amount",
  "price",
  "discount_value",
  "discount_type",
  "technical_team_id",
  "finalprice",
];

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function TechPaysTable() {
  const { id, invoiceId, transactionId, type, role } = useParams();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [techPays, setTechPays] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [technicalTeams, setTechnicalTeams] = useState([]);
  const [loadingTechnicalTeams, setLoadingTechnicalTeams] = useState(true);
  const [loading, setLoading] = useState(true);
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
    discount_value: "",
    discount_type: "",
  });

  const fetchTechnicalTeams = () => {
    // Using axios
    getTechnicalTeams()
      .then((response) => {
        setTechnicalTeams(response.data.technicalteams); // axios get data in response.data
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
  };
  useEffect(() => {
    fetchTechnicalTeams();
  }, []);

  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTechPays(type);
      setTechPays(response.data.techPays);
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: `عملية برمجية رقم : ${err.message}`,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async () => {
    if (!invoiceId) {
      addToast({
        title: "خطأ",
        description: "لم يتم تحديد الفاتورة المرتبطة.",
        color: "danger",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...technicalPays,
        invoice_id: invoiceId,
        amount: Number(technicalPays.amount),
        price: Number(technicalPays.price),
        finalprice: Number(technicalPays.finalprice),
        discount_value:
          technicalPays.discount_value === "" ||
          technicalPays.discount_value == null
            ? 0
            : Number(technicalPays.discount_value),

        discount_type:
          technicalPays.discount_type === "" ||
          technicalPays.discount_type == null
            ? "قيمة"
            : technicalPays.discount_type,
      };

      await addTechPays(payload);

      addToast({
        title: "تمت العملية بنجاح",
        description: "تمت إضافة مبلغ جديدة",
        color: "success",
      });

      setTechnicalPays({
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
        discount_value: "",
        discount_type: "",
      });

      fetchData();
    } catch (err) {
      addToast({
        title: "حدث خطأ",
        description: `عملية برمجية رقم : ${err.message}`,
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pages = Math.ceil(techPays.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...techPays];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (techPays) =>
          techPays.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          techPays.desc?.toLowerCase().includes(filterValue.toLowerCase()) ||
          String(techPays.price)
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          techPays.technicalteam?.name
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          techPays.amount?.toString().includes(filterValue)
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((invoices) =>
        Array.from(statusFilter).includes(invoices.status)
      );
    }

    return filteredUsers;
  }, [techPays, filterValue, statusFilter, hasSearchFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((techPays, columnKey) => {
    const cellValue = techPays[columnKey];

    switch (columnKey) {
      case "payed":
        if (techPays.payed === 1) {
          return <Chip color="success">مستلم</Chip>;
        } else {
          return <Chip color="danger">غير مستلم</Chip>;
        }
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Button
              isIconOnly
              aria-label="طباعة"
              color="primary"
              variant="faded"
              onPress={() =>
                navigate(
                  `/tresure/${role}/${id}/invoices/${transactionId}/${type}/info/${invoiceId}/print/tech/${techPays.id}`
                )
              }
            >
              <PrintIcon />
            </Button>

            <UpdateTechPaysModal onSaveSuccess={fetchData} id={techPays.id} />
            <DeleteTechPaysModal onSaveSuccess={fetchData} id={techPays.id} />
          </div>
        );
      case "technical_team_id":
        return techPays.technicalteam?.name || "-";
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-3">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder=" بحث..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  الأعمدة
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            عدد حسابات الحرفيين {techPays.length}
          </span>
          <label className="flex items-center text-default-400 text-small">
            عدد الأسطر بالصفحة:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    rowsPerPage,
    fetchData,
    techPays.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 ltr-grid px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400 ">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} من ${items.length} محددة`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "first:group-data-[first=true]/tr:before:rounded-none",
        "last:group-data-[first=true]/tr:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "first:group-data-[last=true]/tr:before:rounded-none",
        "last:group-data-[last=true]/tr:before:rounded-none",
      ],
    }),
    []
  );

  useEffect(() => {
    const amount = Number(technicalPays.amount) || 0;
    const price = Number(technicalPays.price) || 0;
    const discountValue = Number(technicalPays.discount_value) || 0;
    const discountType = technicalPays.discount_type || "قيمة";

    let finalPrice = amount * price;

    if (discountType === "نسبة") {
      finalPrice = finalPrice - finalPrice * (discountValue / 100);
    } else {
      finalPrice = finalPrice - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    setTechnicalPays((prev) => ({
      ...prev,
      finalprice: finalPrice,
    }));
  }, [
    technicalPays.amount,
    technicalPays.price,
    technicalPays.discount_value,
    technicalPays.discount_type,
  ]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-2 w-full">
        <Spinner
          classNames={{ label: "text-foreground" }}
          label="جاري التحميل..."
          variant="wave"
        />
      </div>
    );

  return (
    <>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"لا توجد فواتير حرفيين"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="relative w-full">
        <div className="flex flex-col">
          <div className="w-full bg-white shadow-lg border-t p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <Input
                size="sm"
                label="الاسم"
                className="max-w-[160px]"
                isRequired
                value={technicalPays.name}
                onChange={(e) =>
                  setTechnicalPays({ ...technicalPays, name: e.target.value })
                }
              />

              <Input
                size="sm"
                label="الشرح"
                className="max-w-[180px]"
                value={technicalPays.desc}
                onChange={(e) =>
                  setTechnicalPays({ ...technicalPays, desc: e.target.value })
                }
              />

              <Input
                size="sm"
                label="الكمية"
                type="number"
                isRequired
                className="max-w-[100px]"
                value={technicalPays.amount}
                onChange={(e) => {
                  setTechnicalPays({
                    ...technicalPays,
                    amount: e.target.value,
                  });
                }}
              />

              <Input
                size="sm"
                label="السعر"
                isRequired
                type="number"
                className="max-w-[100px]"
                value={technicalPays.price}
                onChange={(e) => {
                  setTechnicalPays({
                    ...technicalPays,
                    price: e.target.value,
                  });
                }}
              />

              <Input
                label="قيمة الخصم"
                className="max-w-[100px]"
                type="number"
                value={technicalPays.discount_value}
                onChange={(e) =>
                  setTechnicalPays({
                    ...technicalPays,
                    discount_value: e.target.value,
                  })
                }
              />

              <Select
                label="نوع الخصم"
                className="max-w-[200px]"
                placeholder="اختر نوع الخصم"
                selectedKeys={
                  technicalPays.discount_type
                    ? [technicalPays.discount_type]
                    : ["قيمة"]
                }
                onChange={(e) =>
                  setTechnicalPays({
                    ...technicalPays,
                    discount_type: e.target.value,
                  })
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
                size="sm"
                label="السعر النهائي"
                isReadOnly
                className="max-w-[110px]"
                value={technicalPays.finalprice}
              />

              <Input
                size="sm"
                label="اسم الورشة"
                isRequired
                className="max-w-[150px]"
                value={technicalPays.workshopname}
                onChange={(e) =>
                  setTechnicalPays({
                    ...technicalPays,
                    workshopname: e.target.value,
                  })
                }
              />

              <Checkbox
                size="sm"
                isSelected={technicalPays.payed}
                onValueChange={(value) =>
                  setTechnicalPays({ ...technicalPays, payed: value })
                }
              >
                مدفوع
              </Checkbox>

              <Autocomplete
                isRequired
                className="max-w-[180px]"
                placeholder={
                  loadingTechnicalTeams ? "جاري التحميل..." : "الفريق الحرفي"
                }
                selectedKey={technicalPays.technical_team_id}
                onSelectionChange={(key) =>
                  setTechnicalPays({ ...technicalPays, technical_team_id: key })
                }
              >
                {technicalTeams.map((item) => (
                  <AutocompleteItem key={item.id} value={item.id}>
                    {item.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Button
                size="sm"
                color="primary"
                isLoading={submitting}
                onPress={onSubmit}
              >
                إضافة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TechPaysTable;
