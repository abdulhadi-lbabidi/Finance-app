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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { addLogicPays, getLogicPays, getLogicTeams } from "../../api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchIcon from "../SVG/SearchIcon";
import ChevronDownIcon from "../SVG/ChevronDownIcon";
import {
  DeleteLogicPaysModal,
  UpdateLogicPaysModal,
} from "../Modals/LogicPaysModals";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "الاسم", uid: "name", sortable: true },
  { name: "الشرح", uid: "desc", sortable: true },
  { name: "مدفوعة", uid: "payed", sortable: true },
  { name: "القيمة", uid: "amount", sortable: true },
  { name: "السعر", uid: "price", sortable: true },
  { name: "مراقب ورشة", uid: "logistic_team_id", sortable: true },
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
  "logistic_team_id",
  "finalprice",
];

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function LogicPaysTable() {
  const { invoiceId } = useParams();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [logicPays, setLogicPays] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [logisticTeams, setLogisticTeams] = useState([]);

  const [loadingLogisticTeams, setLoadingLogisticTeams] = useState(true);
  const [loading, setLoading] = useState(true);
  const [logisticPays, setLogisticPays] = useState({
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

  const fetchLogisticTeams = () => {
    // Using axios
    getLogicTeams()
      .then((response) => {
        setLogisticTeams(response.data.logisticteams); // axios get data in response.data
        setLoadingLogisticTeams(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoadingLogisticTeams(false);
      });
  };
  useEffect(() => {
    fetchLogisticTeams();
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
  const { type } = useParams();

  const fetchData = () => {
    // Using axios
    getLogicPays(type)
      .then((response) => {
        setLogicPays(response.data.logicPays); // axios get data in response.data
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

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
        ...logisticPays,
        invoice_id: invoiceId,
        amount: Number(logisticPays.amount),
        price: Number(logisticPays.price),
        finalprice: Number(logisticPays.finalprice),
      };

      await addLogicPays(payload);

      addToast({
        title: "تمت العملية بنجاح",
        description: "تمت إضافة مبلغ جديدة",
        color: "success",
      });

      setLogisticPays({
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

  const pages = Math.ceil(logicPays.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...logicPays];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (logicPays) =>
          logicPays.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          logicPays.desc?.toLowerCase().includes(filterValue.toLowerCase()) ||
          String(logicPays.price)
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          logicPays.logisticteam?.name
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          logicPays.amount?.toString().includes(filterValue)
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
  }, [logicPays, filterValue, statusFilter, hasSearchFilter]);

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

  const renderCell = useCallback((logicPays, columnKey) => {
    const cellValue = logicPays[columnKey];

    switch (columnKey) {
      case "payed":
        if (logicPays.payed === 1) {
          return <Chip color="success">مستلم</Chip>;
        } else {
          return <Chip color="danger">غير مستلم</Chip>;
        }
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <UpdateLogicPaysModal onSaveSuccess={fetchData} id={logicPays.id} />
            <DeleteLogicPaysModal onSaveSuccess={fetchData} id={logicPays.id} />
          </div>
        );
      case "logistic_team_id":
        return logicPays.logisticteam?.name || "-";
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
            عدد حسابات مراقب ورشة {logicPays.length}
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
    logicPays.length,
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
        <TableBody emptyContent={"لا توجد حسابات حرفيين"} items={sortedItems}>
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
                value={logisticPays.name}
                onChange={(e) =>
                  setLogisticPays({ ...logisticPays, name: e.target.value })
                }
              />

              <Input
                size="sm"
                label="الشرح"
                className="max-w-[180px]"
                value={logisticPays.desc}
                onChange={(e) =>
                  setLogisticPays({ ...logisticPays, desc: e.target.value })
                }
              />

              <Input
                size="sm"
                label="الكمية"
                type="number"
                className="max-w-[100px]"
                value={logisticPays.amount}
                onChange={(e) => {
                  const amount = e.target.value;
                  const price = logisticPays.price;
                  const finalprice = Number(price) * Number(amount) || 0;

                  setLogisticPays({
                    ...logisticPays,
                    amount,
                    finalprice,
                  });
                }}
                // onChange={(e) =>
                //   setLogisticPays({ ...logisticPays, amount: e.target.value })
                // }
              />

              <Input
                size="sm"
                label="السعر"
                type="number"
                className="max-w-[100px]"
                value={logisticPays.price}
                onChange={(e) => {
                  const price = e.target.value;
                  const amount = logisticPays.amount;
                  const finalprice = Number(price) * Number(amount) || 0;

                  setLogisticPays({
                    ...logisticPays,
                    price,
                    finalprice,
                  });
                }}
              />

              <Input
                size="sm"
                label="السعر النهائي"
                isReadOnly
                className="max-w-[110px]"
                value={logisticPays.finalprice}
              />

              <Input
                size="sm"
                label="اسم الورشة"
                className="max-w-[150px]"
                value={logisticPays.workshopname}
                onChange={(e) =>
                  setLogisticPays({
                    ...logisticPays,
                    workshopname: e.target.value,
                  })
                }
              />

              <Checkbox
                size="sm"
                isSelected={logisticPays.payed}
                onValueChange={(value) =>
                  setLogisticPays({ ...logisticPays, payed: value })
                }
              >
                مدفوع
              </Checkbox>

              <Autocomplete
                isRequired
                className="max-w-[180px]"
                placeholder={
                  loadingLogisticTeams ? "جاري التحميل..." : "مراقب ورشة "
                }
                selectedKey={logisticPays.logistic_team_id}
                onSelectionChange={(key) =>
                  setLogisticPays({ ...logisticPays, logistic_team_id: key })
                }
              >
                {logisticTeams.map((item) => (
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

export default LogicPaysTable;
