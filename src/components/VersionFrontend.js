import React from "react";
import packageInfo from "../../package.json";


const VersionFrontend = () => {
  return (
    <>
      {packageInfo.version && (
        <span className="version">{packageInfo.version}</span>
      )}
    </>
  );
};

export default VersionFrontend;