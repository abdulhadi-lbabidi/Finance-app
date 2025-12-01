import { useParams } from "react-router-dom";
import AdminTresure from "../pages/Tresures/AdminTresure";
import EmployeeTresure from "../pages/Tresures/EmployeeTresure";
import WorkshopTresure from "../pages/Tresures/WorkshopTresure";
import CustomerTresure from "../pages/Tresures/CustomerTresure";
import OfficeTresure from "../pages/Tresures/OfficeTresure";
import DepositTresure from "../pages/Tresures/DepositTresure";

export default function DynamicTresurePage() {
  const { role } = useParams();

  switch (role) {
    case "admin":
      return <AdminTresure />;
    case "employee":
      return <EmployeeTresure />;
    case "workshop":
      return <WorkshopTresure />;
    case "customer":
      return <CustomerTresure />;
    case "office":
      return <OfficeTresure />;
    case "deposit":
      return <DepositTresure />;
    default:
      return <div>Invalid Role</div>;
  }
}
