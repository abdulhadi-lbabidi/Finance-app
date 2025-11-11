import {
  Accordion,
  AccordionItem,
  addToast,
  Divider,
  Link,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

import { getWorkshopEmployees } from "../../api";
import {
  AddWorkshopEmployeeModal,
  DeleteWorkshopEmployeeModal,
} from "../../components/Modals/WorkshopEmployeeModals";

function EmployeeForWorkshop() {
  const [search, setSearch] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    // Using axios
    getWorkshopEmployees()
      .then((response) => {
        setWorkshops(response.data.workshops); // axios puts data in response.data
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
  const filteredData = workshops.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    // Check if any phone number includes search term
    const employeeMatch = item.employees.some((employee) =>
      employee.name.includes(search)
    );

    return nameMatch || employeeMatch;
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
                {item.employees.map((employee, i) => (
                  <li key={employee.id} className="text-gray-700 my-3">
                    <div className="grid grid-cols-4 g-4">
                      <div className="col-span-3">
                        <span className="font-semibold">{employee.name}</span>{" "}
                        {/* <Link href={"tel:" + phone.number}>{phone.number}</Link> */}
                      </div>
                      <DeleteWorkshopEmployeeModal
                        onSaveSuccess={fetchData}
                        id={employee.id}
                        pivotid={employee.pivot.id}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <Divider className="my-5" />
              <AddWorkshopEmployeeModal
                onSaveSuccess={fetchData}
                id={item.id}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default EmployeeForWorkshop;
