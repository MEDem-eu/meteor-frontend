import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@material/web/button/filled-button.js";
import { useClient } from "../client/ClientProvider";
import PasswordField from "../components/PasswordField";

const ChangePassword = () => {
  const { profile, isLoading, clientFetchPost, logout } = useClient();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [old_pw, setOldPassword] = useState("");
  const [new_pw, setNewPassword] = useState("");
  const [confirm_new, setConfirmPassword] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!profile) {
      logout("expired");
    }
  }, [profile, isLoading, logout]);

  async function resetPwd(credentials) {
    const response = await clientFetchPost("user/password/change", credentials);

    return response.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ret = await resetPwd({
      old_pw,
      new_pw,
      confirm_new,
    });
    console.log(ret);
    if (ret.status === 200) {
      setError(null);
      navigate("/profile?msg=" + ret.message);
    } else {
      setError(ret.message);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-register">
          <PasswordField
            label="Old Password"
            name="old_password"
            value={old_pw}
            onInput={(e) => setOldPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="login-register">
          <PasswordField
            label="New Password"
            name="new_password"
            value={new_pw}
            onInput={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="login-register">
          <PasswordField
            label="Confirm Password"
            name="confirm_new_password"
            value={confirm_new}
            onInput={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && <div className="login-register error">{error}</div>}

        <div className="login-register">
          <md-filled-button class="md-button-manual-outline" type="submit">
            Change Password
          </md-filled-button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
