import SearchForm from "../forms/SearchForm";
import Login from "../user/Login";
import SlickRecent from "../components/SlickRecent";
import { useSearchParams, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useClient } from "../client/ClientProvider";

const Home = () => {
  const { profile, isLoggedIn, logout } = useClient();

  const [searchParams] = useSearchParams();
  const logoutMessage = searchParams.get("logout")
    ? "logout"
    : searchParams.get("expired")
      ? "expired"
      : searchParams.get("accountDeleted")
        ? "accountDeleted"
        : null;

  const setSubmit = (but) => {
    return document.getElementById(but);
  };

  useEffect(() => {
    // getData()
    // add listener for pressing 'Enter' button
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        //console.log(document.activeElement.getAttribute('name'))
        if (
          document.activeElement.getAttribute("name") === "username" ||
          document.activeElement.getAttribute("name") === "password" ||
          document.activeElement.getAttribute("name") === "rememberMe"
        ) {
          document.getElementById("submitFormLogin").click();
        } else {
          document.getElementById("submitFormSearch").click();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <>
      <h1>Welcome to MEDem Meteor</h1>

      <div className="home-login">
        {!isLoggedIn && <Login entry="home" />}

        {/* {loggedIn && (
          <>
            {loggedIn.status === 200 && ( */}
        {isLoggedIn && (
          <>
            {isLoggedIn && (
              <>
                <p>
                  You are logged in
                  {profile && (
                    <>
                      &nbsp;as:
                      <br />
                      <Link to="/profile/">{profile.email}</Link>
                    </>
                  )}
                </p>
                <div
                  align="right"
                  style={{ borderTop: "1px solid grey", paddingTop: "10px" }}
                >
                  <md-text-button
                    type="button"
                    onClick={() => logout("logout")}
                  >
                    Logout
                  </md-text-button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="home-text">
        {logoutMessage && (
          <>
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: "var(--color-primary)",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <span className="message">
                {logoutMessage === "expired"
                  ? "Your session expired. Please log in again."
                  : logoutMessage === "accountDeleted"
                    ? "Your account was deleted."
                    : "You are logged out!"}
              </span>
              {logoutMessage === "expired" && (
                <>
                  <br />
                  <strong>Hint:</strong> Try ticking the 'Remember Me' box when
                  logging in to stay logged in for longer!
                </>
              )}
            </div>
          </>
        )}

        <p>
          Quickly and easily query our database of political text resources. Our
          database is a collection of data, tools and more that have been
          curated for the political text community.
        </p>
        <p>
          Our platform has resources for the seasoned pro and those new to text
          analysis. Journalists, non-academic researchers and policy
          practitioners will find resources to support their political text
          journey. Find out which databases hold the text data that you are
          looking for.
        </p>
        <p>
          Do you have a specific source in mind? Try typing the name in the
          search bar and check if the entry already exists!
        </p>

        {<SearchForm />}
      </div>

      <br clear="all" />
      {<SlickRecent />}
    </>
  );
};

export default Home;
