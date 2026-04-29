import { Link, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCheckForm from "./AddCheckForm";
import React, { useContext, useEffect, useState } from "react";

import { useClient } from "../client/ClientProvider";

const Add = () => {

  const { isLoggedIn, isLoading } = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      navigate("/logout");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return (
    <>
      {isLoggedIn && (
        <>
          <h1>Add New Entry</h1>

          <div className="infobox">
            <h3>First time doing this?</h3>

            <p>
              Please quickly read through our{" "}
              <Link to="/guides/newssource">
                detailed guide for adding entries
              </Link>{" "}
              to the inventory.
            </p>

            <h4>Quick Tips</h4>
            <ul>
              <li>
                The <InfoIcon /> icons next to the questions give you additional
                information and explanations
              </li>
              <li>
                The <MenuBookIcon /> icons give you ideas on how to retrieve
                some specific information.
              </li>
            </ul>
          </div>

          <br />
          <br />

          <AddCheckForm />
        </>
      )}
    </>
  );
};

export default Add;
