import FloatingShape from "../components/authPageComponents/FloatingShape";
import ErrorDisplay from "../components/globalComponents/ErrorDisplay";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br
      from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden"
    >
      <ErrorDisplay />

      <FloatingShape
        color="bg-[#6499E9]"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#9EDDFF]"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#A6F6FF]"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Outlet /> {/* This renders the actual page content */}
    </div>
  );
};

export default AuthLayout;
