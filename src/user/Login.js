import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/textfield/outlined-text-field.js";
import '@material/web/button/outlined-button.js';
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import { useClient } from "../client/ClientProvider";


export default function Login({ entry = "login" }) {
  const { login } = useClient();

  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  let login_page = window.location.href.indexOf("login") >= 0;

  const message = searchParams.get("msg");
  const verified = searchParams.get("verified");

  let verificationMessage = null;
  let verificationError = null;

  if (verified === "true") {
    verificationMessage = "Email verified! You can now try to log in.";
  }

  if (verified === "false") {
    verificationError =
      "Verification link is expired or invalid! Please try resending a verification Email and if the problem persits please contact us.";
  }

  // for debugging
  useEffect(() => {
    console.log("rememberMe state:", rememberMe);
  }, [rememberMe]);

  useEffect(() => {
    if (entry === "login") {
      // add listener for pressing 'Enter' button
      const listener = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
          document.getElementById("submitFormLogin").click();
        }
      };
      document.addEventListener("keydown", listener);
      return () => {
        document.removeEventListener("keydown", listener);
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password, rememberMe);
      setError(null);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };

  const changeEmail = (e) => {
    console.log("email changed", e);
    setEmail(e.target.value);
  };

  const changePassword = (e) => {
    console.log("password changed", e);
    setPassword(e.target.value);
  };

  return (
    <div>
      <h2>Log In</h2>
      {message && <div className="message">{message}</div>}
      {verificationMessage && (
        <div className="message">{verificationMessage}</div>
      )}
      {verificationError && (
        <>
          <div className="message">{verificationError}</div>
          <md-filled-button
            type="button"
            onClick={() => navigate("/register/resend")}
          >
            Resend Verification Email?
          </md-filled-button>
          <br /> <br /> <br />
        </>
      )}
      <form onSubmit={handleSubmit}>
        <div className="login-register">
          <strong>Email:</strong>
          <br />
          <input
            type="email"
            name="username"
            onChange={(e) => changeEmail(e)}
            required
          />
        </div>

        <div className="login-register">
          <strong>Password:</strong>
          <br />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-register">
          <label className="remember-me">
            <input
              className="remember-me-checkbox"
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember Me</span>
          </label>
        </div>

        {error && (
          <>
            <div className="login-register error">
              {error}
              <br />
              Have you verified your email?
              <br />
              <md-filled-button
                type="button"
                onClick={() => navigate("/register/resend")}
              >
                Resend Verification Email?
              </md-filled-button>
            </div>
          </>
        )}

        <div className={login_page ? "login-register md-button-on-white" : "login-register md-button-on-primary"}>
          <md-filled-button
            class="md-button-manual-outline"
            type="submit"
            id="submitFormLogin"
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Login
          </md-filled-button>
          <md-outlined-button
            type="button"
            onClick={() => navigate("/password/reset")}
          >
            Forgot Password?
          </md-outlined-button>
          {login_page && (
            <md-outlined-button
              style={{ marginLeft: "10px" }}
              type="button"
              onClick={() => navigate("/register")}
            >
              Need an account? Sign Up
            </md-outlined-button>
          )}
        </div>
      </form>
    </div>
  );
}

