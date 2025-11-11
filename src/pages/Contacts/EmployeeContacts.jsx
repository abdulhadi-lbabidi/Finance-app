import {
  Accordion,
  AccordionItem,
  addToast,
  Divider,
  Link,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import {
  AddPhoneModalWithoutData,
  DeletePhoneModalWithoutData,
} from "../../components/Modals/ReuseableModals";
import { getPhoneTypes } from "../../api";

function EmployeeContacts() {
  const [search, setSearch] = useState("");
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    // Using axios
    getPhoneTypes("employee")
      .then((response) => {
        setPhones(response.data.phones); // axios puts data in response.data
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
  const filteredData = phones.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    // Check if any phone number includes search term
    const phoneMatch = item.phones.some((phone) =>
      phone.number.includes(search)
    );

    return nameMatch || phoneMatch;
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم او الرقم"
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
              <ul>
                {item.phones.map((phone, i) => (
                  <li key={i} className="text-gray-700 my-3">
                    <div className="grid grid-cols-4 g-4">
                      <div className="col-span-3">
                        <span className="font-semibold">{phone.name}:</span>{" "}
                        <Link href={"tel:" + phone.number}>{phone.number}</Link>
                      </div>
                      <DeletePhoneModalWithoutData
                        onSaveSuccess={fetchData}
                        id={phone.id}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <Divider className="my-5" />
              <AddPhoneModalWithoutData
                onSaveSuccess={fetchData}
                id={item.id}
                type={"employee"}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
export default EmployeeContacts;
