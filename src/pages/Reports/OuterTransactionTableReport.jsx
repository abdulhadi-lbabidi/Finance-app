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
} from "@heroui/react";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { getTresureFundReport } from "../../api";
import PrintIcon from "../../components/SVG/PrintIcon";
import SearchIcon from "../../components/SVG/SearchIcon";
export default function OuterTransactionTableReport({ fundId }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setLoading(true);

    getTresureFundReport(fundId)
      .then((res) => {
        setItemsData(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [fundId]);

  const [page, setPage] = useState(1);

  const pages = Math.ceil(itemsData.length / rowsPerPage);

  const filteredItems = useMemo(() => {
    if (!filterValue) return itemsData;

    return itemsData.filter((item) =>
      item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [itemsData, filterValue]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

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
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          color="default"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>

      <Select
        size="sm"
        label="ترتيب حسب"
        selectedKeys={[sortBy]}
        className="max-w-[140px]"
        onChange={(e) => setSortBy(e.target.value)}
      >
        {sortOptions.map((opt) => (
          <SelectItem key={opt.key} value={opt.key}>
            {opt.label}
          </SelectItem>
        ))}
      </Select>

      {/* اليمين - asc / desc */}
      <Button
        size="sm"
        variant="flat"
        onPress={() =>
          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        }
      >
        {sortDirection === "asc" ? "تصاعدي ↑" : "تنازلي ↓"}
      </Button>
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
      topContentPlacement="outside"
      bottomContentPlacement="outside"
    >
      <TableHeader>
        <TableColumn key="name">الاسم</TableColumn>
        <TableColumn key="desc">الوصف</TableColumn>
        <TableColumn key="amount">الكمية</TableColumn>
        <TableColumn key="price">السعر</TableColumn>
        <TableColumn key="payed">مدفوع</TableColumn>
        <TableColumn key="discount_value">قيمة الخصم</TableColumn>
        <TableColumn key="discount_type">نوع الخصم</TableColumn>
        <TableColumn key="finalprice">السعر النهائي</TableColumn>
        <TableColumn key="created_at">تاريخ الإنشاء</TableColumn>
      </TableHeader>

      <TableBody items={paginatedItems}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.desc ?? "-"}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.payed ? "✔" : "✘"}</TableCell>
            <TableCell>{item.discount_value}</TableCell>
            <TableCell>{item.discount_type}</TableCell>
            <TableCell>{item.finalprice}</TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
