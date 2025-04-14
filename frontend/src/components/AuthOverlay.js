import React from "react";
import AuthModal from "../components/authModal";
import { useAuth } from "../context/AuthContext";

const AuthOverlay = () => {
  const { user } = useAuth();

  return (
    !user && (
      <div className="auth-overlay">
        <AuthModal />
      </div>
    )
  );
};

export default AuthOverlay;
