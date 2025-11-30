import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Button,
  Spinner,
  SelectItem,
  Select,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { getTresureFundReport, getTresureFundsReport } from "../../api";
import PrintIcon from "../../components/SVG/PrintIcon";
import SearchIcon from "../../components/SVG/SearchIcon";
import ChevronDownIcon from "../../components/SVG/ChevronDownIcon";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "الاسم", uid: "name", sortable: true },
  { name: "الوصف", uid: "desc", sortable: true },
  { name: "الكمية", uid: "amount", sortable: true },
  { name: "البند", uid: "finance_item_name", sortable: true },
  { name: " السعر", uid: "price", sortable: true },
  { name: "مدفوع", uid: "payed", sortable: true },
  { name: "نوع الخصم", uid: "discount_type", sortable: true },
  { name: "قيمة الخصم", uid: "discount_value", sortable: true },
  { name: "السعر النهائي", uid: "finalprice", sortable: true },
  { name: "تاريخ الإنشاء", uid: "created_at", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "desc",
  "amount",
  "finance_item_name",
  "price",
  "payed",
  "discount_type",
  "discount_value",
  "finalprice",
  "created_at",
];

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export default function OuterTransactionTableReport({
  fundId,
  tresureId,
  allFundsSelected,
}) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "id",
    direction: "ascending",
  });
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);

  // useEffect(() => {
  //   setLoading(true);

  //   getTresureFundReport(fundId)
  //     .then((res) => {
  //       setItemsData(res.data.items);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoading(false);
  //     });
  // }, [fundId]);

  useEffect(() => {
    setLoading(true);

    if (allFundsSelected) {
      getTresureFundsReport(tresureId).then((res) => {
        setItemsData(res.data.items);
        setLoading(false);
      });
    } else {
      getTresureFundReport(fundId).then((res) => {
        setItemsData(res.data.items);
        setLoading(false);
      });
    }
  }, [fundId, tresureId, allFundsSelected]);

  const [page, setPage] = useState(1);

  const pages = Math.ceil(itemsData.length / rowsPerPage);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!filterValue) return itemsData;

    return itemsData.filter((item) =>
      item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [itemsData, filterValue]);

  function formatDate(dateStr) {
    return format(new Date(dateStr), "dd/MM/yyyy");
  }

  // --------------------
  // PRINT HANDLERS
  // --------------------

  const handlePrintAll = () => {
    console.log("طباعة كل العناصر:", itemsData);
    window.print();
  };

  const handlePrintSelected = () => {
    const selected = itemsData.filter((item) => selectedKeys.has(item.id));

    console.log("طباعة المحدد:", selected);
    window.print();
  };
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      const numericColumns = [
        "amount",
        "price",
        "discount_value",
        "finalprice",
        "id",
      ];
      if (numericColumns.includes(sortDescriptor.column)) {
        first = Number(first) || 0;
        second = Number(second) || 0;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [sortedItems, page, rowsPerPage]);

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          isClearable
          placeholder="بحث عن الاسم..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          className="w-full max-w-xs"
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />

        <div className="flex gap-2">
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

          <Button
            color="default"
            size="sm"
            startContent={<PrintIcon size={16} />}
            onPress={handlePrintAll}
          >
            طباعة الكل
          </Button>

          <Button
            color="default"
            size="sm"
            startContent={<PrintIcon size={16} />}
            onPress={handlePrintSelected}
          >
            طباعة المحدد
          </Button>
        </div>
      </div>
    </div>
  );
  const sortOptions = [
    { key: "name", label: "البند" },
    { key: "amount", label: "الكمية" },
  ];

  const bottomContent = (
    <div className="w-full flex items-center justify-between py-2 px-2">
      <Select
        size="sm"
        label="ترتيب حسب"
        selectedKeys={[sortDescriptor.column]}
        className="max-w-[140px]"
        onChange={(e) =>
          setSortDescriptor((prev) => {
            return {
              ...prev,
              column: e.target.value,
              direction: "ascending",
            };
          })
        }
      >
        {sortOptions.map((opt) => (
          <SelectItem key={opt.key} value={opt.key}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>

      <Button
        size="sm"
        variant="flat"
        onPress={() =>
          setSortDescriptor((prev) => ({
            ...prev,
            direction:
              prev.direction === "ascending" ? "descending" : "ascending",
          }))
        }
      >
        {sortDescriptor.direction === "ascending" ? "تصاعدي ↑" : "تنازلي ↓"}
      </Button>

      <Pagination
        showControls
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-10 w-full">
        <Spinner label="جاري التحميل..." variant="wave" />
      </div>
    );

  return (
    <Table
      aria-label="Outer transaction report"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      bottomContent={bottomContent}
      onSortChange={setSortDescriptor}
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody emptyContent="لا توجد مواد مصروفة" items={paginatedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              if (columnKey === "created_at") {
                return <TableCell>{formatDate(item.created_at)}</TableCell>;
              }

              if (columnKey === "payed") {
                return <TableCell>{item.payed ? "✔" : "✘"}</TableCell>;
              }

              return <TableCell>{item[columnKey] ?? "-"}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
