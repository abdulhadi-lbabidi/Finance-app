import {
  addToast,
  Button,
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
import { getInvoicesImages } from "../../api";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "../SVG/SearchIcon";
import ChevronDownIcon from "../SVG/ChevronDownIcon";
import PDFIcon from "../SVG/PDFIcon";
import {
  AddInvoiceImageModals,
  DeleteInvoicesImageModals,
} from "../Modals/InvoiceImageModals";
import DownloadIcon from "../SVG/DownloadIcon";
import { InvoiceImagePreviewModal } from "../Modals/InvoiceImagePreviewModal";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "الصورة", uid: "image", sortable: true },
  { name: "عمليات", uid: "actions" },
];
const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];
const INITIAL_VISIBLE_COLUMNS = ["image", "actions"];

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function ImagePaysTable() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [invoiceImage, setInvoiceImage] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchData = useCallback(() => {
    getInvoicesImages("invoice")
      .then((response) => {
        setInvoiceImage(response.data.invoices);
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pages = Math.ceil(invoiceImage.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...invoiceImage];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((invoiceImage) =>
        invoiceImage.image.toLowerCase().includes(filterValue.toLowerCase())
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
  }, [invoiceImage, filterValue, statusFilter, hasSearchFilter]);

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

  const handelDownload = (imageId) => {
    window.open(
      `http://127.0.0.1:8000/api/data/invoices-images/download/${imageId}`,
      "_self"
    );
  };

  const renderCell = useCallback((invoiceImage, columnKey) => {
    const cellValue = invoiceImage[columnKey];

    switch (columnKey) {
      case "image": {
        const url = invoiceImage.fullUrl.toLowerCase();
        const isPdf = url.endsWith(".pdf");

        return (
          <>
            {isPdf ? (
              <PDFIcon />
            ) : (
              <img
                src={invoiceImage.fullUrl}
                alt="invoice"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}
          </>
        );
      }

      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Button onPress={() => handelDownload(invoiceImage.id)}>
              <DownloadIcon />
            </Button>

            <InvoiceImagePreviewModal imageUrl={invoiceImage.fullUrl} />

            <DeleteInvoicesImageModals
              onSaveSuccess={fetchData}
              id={invoiceImage.id}
            />
          </div>
        );

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
            <AddInvoiceImageModals onSaveSuccess={fetchData} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            عدد الوثائق {invoiceImage.length}
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
    invoiceImage.length,
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
        <TableBody emptyContent={"لا توجد صور "} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default ImagePaysTable;
