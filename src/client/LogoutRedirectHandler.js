import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "./ClientProvider";

const redirectByReason = {
  logout: "/?logout=true",
  expired: "/?expired=true",
  accountDeleted: "/?accountDeleted=true",
};

export default function LogoutRedirectHandler() {
  const navigate = useNavigate();
  const { logoutReason, setLogoutReason } = useClient();

  useEffect(() => {
    if (!logoutReason) return;

    setLogoutReason(null);
    navigate(redirectByReason[logoutReason] || "/", { replace: true });
  }, [logoutReason]);

  return null;
}