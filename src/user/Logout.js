// import {useContext, useEffect} from 'react';
// import {UserContext} from "./UserContext";
// import {useNavigate} from "react-router-dom";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../client/ClientProvider";

// async function logoutUser(token) {
//     return fetch(process.env.REACT_APP_API + 'user/logout', {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer ' + token
//         },
//     })
//         .then(
//             data => data.json()
//         )
// }

export default function Logout() {
  const navigate = useNavigate();
  // const [token, setToken] = useContext(UserContext);
  const { logout } = useClient();

  // useEffect(() => {
  //     let l = logoutUser(token)
  //     console.log(l)
  //     localStorage.clear();
  //     setToken(null)
  //     navigate("/?logout=true", { replace: true })
  // }, [])

  useEffect(() => {
    async function runLogout() {
      await logout();
      navigate("/?logout=true", { replace: true });
    }

    runLogout();
  }, [logout, navigate]);
}
