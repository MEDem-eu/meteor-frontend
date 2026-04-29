import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../client/ClientProvider";


export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useClient();

  useEffect(() => {
    async function runLogout() {
      await logout();
      navigate("/?logout=true", { replace: true });
    }

    runLogout();
  }, [logout, navigate]);
}
