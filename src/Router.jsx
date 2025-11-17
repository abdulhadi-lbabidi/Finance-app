import { createBrowserRouter } from "react-router-dom";
import ManageLayout from "./Layout/ManageLayout";
import AdminAccounts from "./pages/Account/AdminAccounts";
import CustomerAccounts from "./pages/Account/CustomerAccounts";
import EmployeeAccounts from "./pages/Account/EmployeeAccounts";
import LogisticAccounts from "./pages/Account/LogisticAccounts";
import TechnicalAccounts from "./pages/Account/TechnicalAccounts";
import AdminInventory from "./pages/Inventory/AdminInventory";
import CustomerInventory from "./pages/Inventory/CustomerInventory";
import EmployeeInventory from "./pages/Inventory/EmployeeInventory";
import LogisticInventory from "./pages/Inventory/LogisticInventory";
import TechnicalInventory from "./pages/Inventory/TechnicalInventory";
import WorkshopInventory from "./pages/Inventory/WorkshopInventory";
import AdminType from "./pages/Types/AdminType";
import Department from "./pages/Types/Department";
import EmployeeType from "./pages/Types/EmployeeType";
import FinanceItem from "./pages/Types/FinanceItem";
import SocialMediaType from "./pages/Types/SocialMediaType";
import UserNotes from "./pages/Note/UserNotes";
import AdminContacts from "./pages/Contacts/AdminContacts";
import CustomerContacts from "./pages/Contacts/CustomerContacts";
import EmployeeContacts from "./pages/Contacts/EmployeeContacts";
import LogisticContacts from "./pages/Contacts/LogisticContacts";
import TechnicalsContacts from "./pages/Contacts/TechnicalsContacts";
import ShowWorkshops from "./pages/Workshop/ShowWorkshops";
import Home from "./pages/Home";
import {
  SelectAdminTresure,
  SelectCustomerTresure,
  SelectEmployeeTresure,
  SelectWorkshopTresure,
} from "./pages/Tresures/Selectors/TresureSelectors";
import MoneyTransfareTable from "./components/Tables/MoneyTransfareTable";
import InnerTransactionTable from "./components/Tables/InnerTransactionTable";
import OuterTransactionTable from "./components/Tables/OuterTransactionTable";
import AdminTresure from "./pages/Tresures/AdminTresure";
import EmployeeForWorkshop from "./pages/Workshop/EmployeeForWorkshop";
import LogisticForWorkshop from "./pages/Workshop/LogisticForWorkshop";
import ItemReport from "./pages/Reports/ItemReport";
import Invoices from "./pages/Invoices";
import InvoiceInfo from "./pages/Invoices/InvoiceInfo";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <ManageLayout />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        // Tresures selectors
        {
          path: "/tresure/admin",
          children: [
            { index: true, element: <SelectAdminTresure /> },
            {
              path: ":id",
              children: [
                { index: true, element: <AdminTresure /> },
                {
                  path: "invoices/:transactionId/:type",
                  element: <Invoices />,
                },
                {
                  path: "invoices/:transactionId/:type/info/:invoiceId",
                  element: <InvoiceInfo />,
                },
              ],
            },
          ],
        },

        // {
        //   path: "/tresure/admin",
        //   element: <SelectAdminTresure />,
        // },
        // {
        //   path: "/tresure/admin/:id",
        //   element: <AdminTresure />,
        // },
        {
          path: "/tresure/employee",
          element: <SelectEmployeeTresure />,
        },
        {
          path: "/tresure/workshop",
          element: <SelectWorkshopTresure />,
        },
        {
          path: "/tresure/customer",
          element: <SelectCustomerTresure />,
        },
        // Accounts
        {
          path: "/admin/accounts",
          element: <AdminAccounts />,
        },
        {
          path: "/employee/accounts",
          element: <EmployeeAccounts />,
        },
        {
          path: "/customer/accounts",
          element: <CustomerAccounts />,
        },
        {
          path: "/technical/accounts",
          element: <TechnicalAccounts />,
        },
        {
          path: "/logistic/accounts",
          element: <LogisticAccounts />,
        },
        // Workshop
        {
          path: "/workshops",
          element: <ShowWorkshops />,
        },
        {
          path: "/workshop/employees",
          element: <EmployeeForWorkshop />,
        },
        {
          path: "/workshop/logistics",
          element: <LogisticForWorkshop />,
        },
        // Reports
        {
          path: "/reports/itemreport",
          element: <ItemReport />,
        },
        // Types
        {
          path: "/type/admin",
          element: <AdminType />,
        },
        {
          path: "/type/employee",
          element: <EmployeeType />,
        },
        {
          path: "/type/financeitem",
          element: <FinanceItem />,
        },
        {
          path: "/type/companydepartment",
          element: <Department />,
        },
        {
          path: "/type/socialmedia",
          element: <SocialMediaType />,
        },
        // inventory
        {
          path: "/inventory/admin",
          element: <AdminInventory />,
        },
        {
          path: "/inventory/customer",
          element: <CustomerInventory />,
        },
        {
          path: "/inventory/employee",
          element: <EmployeeInventory />,
        },
        {
          path: "/inventory/logistic",
          element: <LogisticInventory />,
        },
        {
          path: "/inventory/technical",
          element: <TechnicalInventory />,
        },
        {
          path: "/inventory/workshop",
          element: <WorkshopInventory />,
        },
        // Contacts
        {
          path: "/contact/admin",
          element: <AdminContacts />,
        },
        {
          path: "/contact/customer",
          element: <CustomerContacts />,
        },
        {
          path: "/contact/employee",
          element: <EmployeeContacts />,
        },
        {
          path: "/contact/logistic",
          element: <LogisticContacts />,
        },
        {
          path: "/contact/technical",
          element: <TechnicalsContacts />,
        },
        // note
        {
          path: "/user/notes",
          element: <UserNotes id={1} />,
        },
      ],
    },

    // {
    //   path: "/login",
    //   element: <GustLayout />,
    //   children: [
    //     {
    //       path: "/login",
    //       element: <Login />,
    //     },
    //   ],
    // },
    // {
    //   path: "/ministry",
    //   element: <MinistryLayout />,
    //   children: [
    //     {
    //       path: "/ministry",
    //       element: <Ministry />,
    //     },
    //   ],
    // },
    // {
    //   path: "/",
    //   element: <GuestLayout />,
    //   children: [
    //     {
    //       path: "/",
    //       element: <Home />,
    //     },
    //     {
    //       path: "/about",
    //       element: <About />,
    //     },
    //     {
    //       path: "/ourservices",
    //       element: <Services />,
    //     },
    //     {
    //       path: "/contactus",
    //       element: <Contact />,
    //     },
    //   ],
    // },

    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
