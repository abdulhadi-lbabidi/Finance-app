import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Accordion, AccordionItem } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
function ManageLayout() {
  const TreasureNav = [
    { name: "صناديق المدراء", path: "/tresure/admin" },
    { name: "صناديق الموظفين", path: "/tresure/employee" },
    { name: "صناديق العملاء", path: "/tresure/customer" },
    { name: "صناديق الورشات", path: "/tresure/workshop" },
  ];
  const AccountNav = [
    { name: "حسابات مدراء", path: "/admin/accounts" },
    { name: "حسابات موظفين", path: "/employee/accounts" },
    { name: "حسابات عملاء", path: "/customer/accounts" },
    { name: "حسابات حرفيين", path: "/technical/accounts" },
    { name: "حسابات مراقبين ورشات", path: "/logistic/accounts" },
  ];
  const WorkshopNav = [
    { name: "جميع الورشات", path: "/workshops" },
    { name: "تعيين موظفين للورشة", path: "/workshop/employees" },
    { name: "تعيين مراقب للورشة", path: "/workshop/logistics" },
  ];
  const ReportNav = [
    { name: "تقرير مواد", path: "/reports/itemreport" },
    { name: "تقرير إيرادات ومصاريف", path: "/employee/accounts" },
    { name: "تقرير حساب عميل", path: "/customer/accounts" },
  ];
  const PaysNav = [
    { name: "مدفوعات موظفين", path: "/admin/accounts" },
    { name: "مدفوعات مراقبين ورشات", path: "/employee/accounts" },
    { name: "مدفوعات حرفيين", path: "/customer/accounts" },
  ];
  const TypeNav = [
    { name: "البنود", path: "/type/financeitem" },
    { name: "أقسام", path: "/type/companydepartment" },
    { name: "أنواع المدراء", path: "/type/admin" },
    { name: "أنواع الموظفين", path: "/type/employee" },
    { name: "أنواع حسابات تواصل إجتماعي", path: "/type/socialmedia" },
  ];
  const InventoryNav = [
    { name: "أمانات المدراء", path: "/inventory/admin" },
    { name: "أمانات الموظفين", path: "/inventory/employee" },
    { name: "أمانات العملاء", path: "/inventory/customer" },
    { name: "أمانات الحرفيين", path: "/inventory/technical" },
    { name: "أمانات المراقبين ورشات", path: "/inventory/logistic" },
    { name: "أمانات الورشة", path: "/inventory/workshop" },
  ];
  const ContactNav = [
    { name: "جهات اتصال المدراء", path: "/contact/admin" },
    { name: "جهات اتصال الموظفين", path: "/contact/employee" },
    { name: "جهات اتصال العملاء", path: "/contact/customer" },
    { name: "جهات اتصال الحرفيين", path: "/contact/technical" },
    { name: "جهات اتصال مراقبين ورشات", path: "/contact/logistic" },
  ];

  const itemClasses = {
    base: "w-full",
    title: "font-normal text-medium text-white",
    trigger: " data-[hover=true]:bg-slate-900 rounded-lg flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  return (
    <div className="flex flex-row min-h-screen">
      <div className="min-h-screen w-64 bg-gray-800 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          <NavLink key={"Home"} to={"/home"}>
            لوحة التحكم
          </NavLink>
        </div>
        <Accordion className="text-white" itemClasses={itemClasses}>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="الصناديق"
            className=""
          >
            {TreasureNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="الحسابات"
            className="text-white"
          >
            {AccountNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 2"
            title="الورشات"
            className="text-white"
          >
            {WorkshopNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 2"
            title="تقارير"
            className="text-white"
          >
            {ReportNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="Accordion 2"
            title="مدفوعات المكتب"
            className="text-white"
          >
            {PaysNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="6"
            aria-label="Accordion 2"
            title="أقسام"
            className="text-white"
          >
            {TypeNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="7"
            aria-label="Accordion 2"
            title="أمانات"
            className="text-white"
          >
            {InventoryNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
          <AccordionItem
            key="8"
            aria-label="Accordion 8"
            title="جهات اتصال"
            className="text-white"
          >
            {ContactNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </AccordionItem>
        </Accordion>
        <div className="mt-auto text-white">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Open Menu</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with description"
              variant="faded"
            >
              <DropdownItem key="note">
                <NavLink
                  key={"notes"}
                  to={"/user/notes"}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded hover:bg-slate-200 ${
                      isActive ? "bg-gray-700 font-semibold" : ""
                    }`
                  }
                >
                  ملاحظاتي
                </NavLink>
              </DropdownItem>

              <DropdownItem key="logout" className="text-danger" color="danger">
                تسجيل خروج
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="w-full p-3">
        <Outlet />
      </div>
    </div>
  );
}

export default ManageLayout;
