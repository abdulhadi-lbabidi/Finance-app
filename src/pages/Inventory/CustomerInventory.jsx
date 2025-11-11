import { Accordion, AccordionItem, addToast, Divider } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { getInventories } from "../../api";
import {
  AddInventoryModal,
  DeleteInventoryModal,
  UpdateInventoryModal,
} from "../../components/Modals/InventoryModals";

function CustomerInventory() {
  const [search, setSearch] = useState("");
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    // Using axios
    getInventories("customer")
      .then((response) => {
        setInventories(response.data.inventory); // axios puts data in response.data
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

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  // Filter function to check if searchTerm matches name or any phone number
  const filteredData = inventories.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    // Check if any phone number includes search term
    const inventoryMatch = item.inventories.some((inventory) =>
      inventory.name.includes(search)
    );

    return nameMatch || inventoryMatch;
  });
  return (
    <div className=" mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم او المادة"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Accordion */}
      <div>
        {filteredData.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No results found.
          </div>
        )}
        <Accordion variant="splitted">
          {filteredData.map((item) => (
            <AccordionItem
              key={item.id}
              aria-label={item.name}
              title={item.name}
            >
              <Divider />
              <ul>
                <li className="text-gray-700 my-3">
                  <div className="grid grid-cols-6 w-full g-4">
                    <span className="font-semibold">الاسم</span>{" "}
                    <span className="font-semibold">العدد</span>{" "}
                    <span className="font-semibold">تاريخ</span>{" "}
                    <span className="font-semibold">النوع</span>{" "}
                    <span className="font-semibold">الحالة</span>{" "}
                    <span className="font-semibold">عمليات</span>{" "}
                  </div>
                  <Divider className="my-3" />
                </li>
                {item.inventories.map((inventory, i) => (
                  <li key={i} className="text-gray-700 my-3">
                    <div className="grid grid-cols-6 w-full g-4">
                      <span className="font-semibold">{inventory.name}</span>{" "}
                      <span className="font-semibold">
                        {inventory.quantity}
                      </span>{" "}
                      <span className="font-semibold">
                        {inventory.fromdate}
                      </span>{" "}
                      <span className="font-semibold">{inventory.type}</span>{" "}
                      <span
                        className={`font-semibold ${
                          inventory.statue === "1"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {" "}
                        {inventory.statue === "1" ? "مُستلم" : "غير مُستلم"}
                      </span>{" "}
                      <div className="grid grid-cols-2">
                        <UpdateInventoryModal
                          onSaveSuccess={fetchData}
                          id={inventory.id}
                        />
                        <DeleteInventoryModal
                          onSaveSuccess={fetchData}
                          id={inventory.id}
                        />
                      </div>
                    </div>
                    <Divider className="my-3" />
                  </li>
                ))}
              </ul>
              <AddInventoryModal
                onSaveSuccess={fetchData}
                id={item.id}
                type={"customer"}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default CustomerInventory;
