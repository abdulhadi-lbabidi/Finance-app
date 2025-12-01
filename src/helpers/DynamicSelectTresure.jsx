import { useParams } from "react-router-dom";
import {
  SelectAdminTresure,
  SelectCustomerTresure,
  SelectDepositsTresure,
  SelectEmployeeTresure,
  SelectOfficeTresure,
  SelectWorkshopTresure,
} from "../pages/Tresures/Selectors/TresureSelectors";

export default function DynamicSelectTresure() {
  const { role } = useParams();

  switch (role) {
    case "admin":
      return <SelectAdminTresure />;
    case "employee":
      return <SelectEmployeeTresure />;
    case "workshop":
      return <SelectWorkshopTresure />;
    case "customer":
      return <SelectCustomerTresure />;
    case "office":
      return <SelectOfficeTresure />;
    case "deposit":
      return <SelectDepositsTresure />;
    default:
      return <div>Invalid Role</div>;
  }
}
