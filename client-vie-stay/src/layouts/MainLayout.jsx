import ErrorDisplay from "../components/globalComponents/ErrorDisplay";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ErrorDisplay />
      <Outlet />
    </div>
  );
};

export default MainLayout;
