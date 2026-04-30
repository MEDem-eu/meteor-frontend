import { useNavigate, Link, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useClient } from "../client/ClientProvider";

const AddCheck = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [duplicates, setDuplicates] = useState([]);
  const [count, setCount] = useState("Loading");
  const { token, isLoggedIn, isLoading, clientFetch, logout } = useClient();



  //get querystring
  let entity = "";
  let entryName = "";

  for (let param of searchParams) {
    if (param[0] == "name") {
      entryName = param[1];
    } else {
      if (param[0] == "dgraph_type") {
        entity = param[1];
      }
    }
  }


  const fetchItemData = async () => {
    try {
      const response = await clientFetch(
        "add/check?name=" + entryName + "&dgraph_type=" + entity,
        {
          method: "GET",
        },
      );

      const data = await response.json();

      if (data.length > 0) {
        setCount(data.length);
        setDuplicates(data);
      } else {
        navigate("/add/entry?name=" + entryName + "&dgraph_type=" + entity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      logout("expired");;
      return;
    }

    fetchItemData();
  }, [isLoggedIn, isLoading, navigate]);

  const getQuery = (un) => {
    return "/detail/" + un;
  };

  const retDate = (d) => {
    if (d) {
      let dt = new Date(d);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        dt.getDate().toString().padStart(2, "0")
      );
    }
    return "";
  };

  return (
    <>
      {duplicates.length > 0 && isLoggedIn && (
        <>
          <h1>Add New Entry</h1>

          <div className="infobox">
            <h3>Found following entries matching "{entryName}"</h3>

            <p>
              Please go through the list below and make sure your suggestion is
              not in the inventory yet
            </p>
          </div>

          <p align="center">
            <strong>{count}</strong> record{count === 1 ? "" : "s"}
          </p>

          {duplicates.map((item) => (
            <div className="infobox" key={item.uid}>
              <h4>
                <Link to={getQuery(item._unique_name)}>{item.name}</Link>
              </h4>
              <p>
                {item.entry_review_status}
                <br />
                {retDate(item._date_created)}
              </p>
            </div>
          ))}

          <div>
            <br />
            <h3>Is your suggestion listed above or new?</h3>
            <div style={{ clear: "left", marginBottom: 20 }}>
              <md-filled-button type="button" onClick={() => navigate("/add")}>
                Already listed
              </md-filled-button>
              &nbsp;
              <md-filled-button
                type="button"
                onClick={() =>
                  navigate(
                    "/add/entry?name=" + entryName + "&dgraph_type=" + entity,
                  )
                }
              >
                My suggestion is new
              </md-filled-button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddCheck;
