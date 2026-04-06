import RegisterForm from "@/components/form/auth/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <RegisterForm text="Join our collective of visionary founders" role="STARTUP" />
    </div>
  );
}

export default RegisterPage;