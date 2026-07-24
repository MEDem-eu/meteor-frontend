import React, { useState } from "react";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";

export default function PasswordField({
  label = "Password",
  value,
  onInput,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((currentlyVisible) => !currentlyVisible);
  };

  return (
    <md-filled-text-field
      {...props}
      label={label}
      type={visible ? "text" : "password"}
      value={value ?? ""}
      onInput={onInput}
    >
      <md-icon-button
        slot="trailing-icon"
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={toggleVisibility}
      >
        <md-icon>
          {visible ? "visibility_off" : "visibility"}
        </md-icon>
      </md-icon-button>
    </md-filled-text-field>
  );
}