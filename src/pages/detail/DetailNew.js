import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClient } from "../../client/ClientProvider";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import InfoIcon from "@mui/icons-material/Info";
import DetailReverseSummary from "./DetailReverseSummary";
import DetailReverseList from "./DetailReverseList";
import {
  getFieldLabel,
  getFieldNames,
  getTypeDescription,
  hasDisplayValue,
} from "../../client/schemaHelpers";

const HIDDEN_DETAIL_FIELDS = [
  "_added_by",
  "_date_created",
  "_date_modified",
  "_edited_by",
  "_legacy_id",
  "_reviewed_by",
  "_unique_name",
  "dgraph.type",
  "entry_review_status",
  "uid",
];

const DetailNew = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const { openApi, clientFetchGet, isLoading } = useClient();

  const [item, setItem] = useState(null);
  const [reverse, setReverse] = useState({});
  const [error, setError] = useState(null);

  function getDgraphType(entry) {
    const types = entry?.["dgraph.type"];

    if (!Array.isArray(types)) {
      return null;
    }

    return types.find((type) => type !== "Entry") ?? null;
  }

  function renderExternalLink(value, baseUrl = "") {
    if (!hasDisplayValue(value)) {
      return null;
    }

    const values = Array.isArray(value) ? value : [value];

    return values.map((linkValue, index) => {
      const href = baseUrl + linkValue;

      return (
        <span className="link_list" key={`${href}-${index}`}>
          <a href={href} target="_blank" rel="noreferrer">
            {linkValue}
          </a>
        </span>
      );
    });
  }

  function renderEntryLink(entry) {
    if (!entry?.name) {
      return null;
    }

    const detailId = entry._unique_name ?? entry.uid;

    if (!detailId) {
      return entry.name;
    }

    return <Link to={`/detail-new/${detailId}`}>{entry.name}</Link>;
  }

  function renderDateValue(value) {
    const values = Array.isArray(value) ? value : [value];

    return values.map((dateValue, index) => {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return (
          <span className="link_list" key={`${dateValue}-${index}`}>
            {dateValue}
          </span>
        );
      }

      return (
        <span className="link_list" key={`${dateValue}-${index}`}>
          {date.toLocaleDateString("en-GB")}
        </span>
      );
    });
  }

  function isIsoDateString(value) {
    if (typeof value !== "string") {
      return false;
    }

    return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value);
  }

  function renderFieldValue(value, fieldName = null) {
    if (fieldName === "url") {
      return renderExternalLink(value);
    }

    if (fieldName === "doi") {
      return renderExternalLink(value, "https://doi.org/");
    }

    if (fieldName === "orcid") {
      return renderExternalLink(value, "https://orcid.org/");
    }

    if (fieldName === "wikidata_id") {
      return renderExternalLink(value, "https://www.wikidata.org/wiki/");
    }

    if (
      isIsoDateString(value) ||
      (Array.isArray(value) && value.every(isIsoDateString))
    ) {
      return renderDateValue(value);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((entry, index) => {
        const separator = index > 0 ? ", " : "";

        if (typeof entry === "string" || typeof entry === "number") {
          return (
            <React.Fragment key={`${entry}-${index}`}>
              {separator}
              {entry}
            </React.Fragment>
          );
        }

        if (entry?.name) {
          return (
            <React.Fragment key={entry.uid ?? `${entry.name}-${index}`}>
              {separator}
              {renderEntryLink(entry)}
            </React.Fragment>
          );
        }

        return null;
      });
    }

    if (value?.name) {
      return renderEntryLink(value);
    }

    return null;
  }

  async function fetchItemData() {
    try {
      setError(null);

      const response = await clientFetchGet("view/entry/" + uid);
      const data = await response.json();

      if (data.status) {
        const fallbackResponse = await clientFetchGet("view/uid/" + uid);
        const fallbackData = await fallbackResponse.json();
        setItem(fallbackData);
        await fetchReverseData(fallbackData.uid);
        return;
      }

      setItem(data);
      await fetchReverseData(data.uid);
    } catch (err) {
      console.error(err);
      setError("Could not load entry.");
    }
  }

  async function fetchReverseData(entryUid) {
    if (!entryUid) {
      setReverse({});
      return;
    }

    try {
      const response = await clientFetchGet("view/reverse/" + entryUid);
      const data = await response.json();

      setReverse(data ?? {});
    } catch (err) {
      console.error(err);
      setReverse({});
    }
  }

  useEffect(() => {
    if (isLoading) {
      return;
    }

    fetchItemData();
    document.documentElement.scrollTo(0, 0);
  }, [uid, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <>
        <p>{error}</p>
        <button type="button" onClick={() => navigate("/search")}>
          Back to search
        </button>
      </>
    );
  }

  if (!item) {
    return <p>Loading entry...</p>;
  }

  const type = getDgraphType(item);
  const fieldNames = getFieldNames(openApi, type);
  const typeDescription = getTypeDescription(openApi, type);
  const reverseEntries = Object.entries(reverse).filter(
    ([, value]) => Array.isArray(value) && value.length > 0,
  );

  return (
    <>
      <p style={{ float: "right" }}>
        &nbsp;
        <button type="button" onClick={() => navigate("/search")}>
          New Search
        </button>
      </p>
      <h1>{item.name}</h1>
      <div className="divTable">
        <div className="divTableBody">
          <div className="divTableRow">
            <div className="divTableHead">
              <h3>General Information</h3>
            </div>
          </div>
          <div className="divTableRow">
            <div className="divTableHead">Type:</div>
            <div className="divTableCell">
              {type}
              {typeDescription && (
                <Tooltip
                  title={typeDescription}
                  arrow
                  TransitionComponent={Zoom}
                  placement="right"
                >
                  <InfoIcon
                    fontSize="small"
                    style={{ marginLeft: "6px", verticalAlign: "middle" }}
                  />
                </Tooltip>
              )}
            </div>
          </div>

          {fieldNames.map((fieldName) => {
            const value = item[fieldName];

            if (HIDDEN_DETAIL_FIELDS.includes(fieldName)) {
              return null;
            }

            if (!hasDisplayValue(value)) {
              return null;
            }

            return (
              <div className="divTableRow" key={fieldName}>
                <div className="divTableHead">
                  {getFieldLabel(openApi, type, fieldName)}:
                </div>
                <div className="divTableCell">
                  {renderFieldValue(value, fieldName)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DetailReverseList reverseEntries={reverseEntries} />

      <DetailReverseSummary item={item} type={type} />
    </>
  );
};

export default DetailNew;
