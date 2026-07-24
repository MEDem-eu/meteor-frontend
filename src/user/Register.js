import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import PasswordField from "../components/PasswordField";

async function registerUser(credentials) {
  return fetch(process.env.REACT_APP_API + "user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reg = await registerUser({
      email,
      password,
      confirm_password,
    });
    console.log(reg);

    if (reg.status === 200) {
      navigate("/login?msg=" + reg.message);
    } else {
      setError(reg.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <div className="infobox">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="login-register">
            <md-filled-text-field
              label="Email"
              type="email"
              name="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-register">
            <PasswordField
              label="Password"
              name="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="login-register">
            <PasswordField
              label="Confirm Password"
              name="confirm_password"
              value={confirm_password}
              onInput={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <div className="login-register error">{error}</div>}

          <div className="login-register md-button-on-primary">
            <md-filled-button class="md-button-manual-outline" type="submit">
              Create Account
            </md-filled-button>{" "}
            <md-outlined-button type="button" onClick={() => navigate("login")}>
              Already Have an Account? Sign in
            </md-outlined-button>
          </div>
          <p>
            We save your email address and IP address locally on this server
            (hosted in the EU). Your data is not shared with third parties and
            retained until you decide to delete your account. Your email address
            is used for technical purposes (e.g. login) and to contact you for
            administrative purposes. We reserve the right to process your IP
            address for creating anonymous usage statistics.
          </p>
        </form>
      </div>

      <div className="infobox">
        <h2>Data Privacy (summary)</h2>

        <p>
          This platform respects the General Data Protection Regulation (GDPR,
          in German: Datenschutzgrundverordnung, DSGVO).
        </p>

        <p>
          We save your email address and IP address locally on this server
          (hosted in the EU). Your data is not shared with third parties and
          retained until you decide to delete your account. Your email address
          is used for technical purposes (e.g. login). We reserve the right to
          process your IP address for creating anonymous usage statistics.
        </p>

        <p>
          <strong>
            By creating an account you agree that we store your email address
            and IP address.
          </strong>
        </p>
      </div>
      <div className="infobox">
        <h2>Conditions of Use</h2>

        <p>
          <strong>
            By creating an account you confirm that you have read and
            acknowledged the{" "}
            <Link to="/privacy">Privacy Policy and the Conditions of Use</Link>{" "}
            statements.
          </strong>
        </p>
      </div>
    </div>
  );
};

export default Register;
