import React from "react";
import { useClient } from "../client/ClientProvider";

const Version = () => {
  const { openApi } = useClient();
  const apiVersion = openApi?.info?.version;

  return <>{apiVersion && <span className="version">{apiVersion}</span>}</>;
};

export default Version;