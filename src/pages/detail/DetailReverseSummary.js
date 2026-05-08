// Some entry types do not use /view/reverse/:uid for incoming relationships.
// These are mostly taxonomy/filter entries such as Country, Language,
// ProgrammingLanguage, Channel, TextType, Modality, and Operation.
//
// For these types, the backend adds computed num_* fields to the detail
// response instead, for example num_tool or num_dataset. These are reverse
// relationship counts, not stored schema fields.
//
// This component renders those num_* counts as a Summary section and links each
// count to the search page, where users can inspect the matching entries.

import React from "react";
import { Link } from "react-router-dom";
import { hasDisplayValue } from "../../client/schemaHelpers";

const SUMMARY_QUERY_PREDICATES = {
  Channel: "channel",
  Country: "country",
  Multinational: "country",
  Subnational: "subnational_scope",
  Language: "languages",
  ProgrammingLanguage: "programming_languages",
  TextType: "text_types",
  Modality: "modalities",
  Operation: "methodologies",
};

const SUMMARY_TARGET_TYPES = {
  num_archive: { type: "Archive", label: "Archives" },
  num_collection: { type: "Collection", label: "Collections" },
  num_dataset: { type: "Dataset", label: "Datasets" },
  num_government: { type: "Government", label: "Governments" },
  num_journalisticbrand: {
    type: "JournalisticBrand",
    label: "Journalistic Brands",
  },
  num_learningmaterial: {
    type: "LearningMaterial",
    label: "Learning Materials",
  },
  num_multinational: { type: "Multinational", label: "Multinationals" },
  num_newssource: { type: "NewsSource", label: "News Sources" },
  num_organization: { type: "Organization", label: "Organizations" },
  num_parliament: { type: "Parliament", label: "Parliaments" },
  num_person: { type: "Person", label: "People" },
  num_politicalparty: {
    type: "PoliticalParty",
    label: "Political Parties",
  },
  num_scientificpublication: {
    type: "ScientificPublication",
    label: "Scientific Publications",
  },
  num_subnational: { type: "Subnational", label: "Subnationals" },
  num_tool: { type: "Tool", label: "Tools" },
};

const DetailReverseSummary = ({ item, type }) => {
  const summaryEntries = Object.entries(item ?? {}).filter(
    ([fieldName, value]) =>
      fieldName.startsWith("num_") && hasDisplayValue(value),
  );

  if (summaryEntries.length === 0) {
    return null;
  }

  function getSummarySearchLink(summaryFieldName) {
    const target = SUMMARY_TARGET_TYPES[summaryFieldName];
    const queryPredicate = SUMMARY_QUERY_PREDICATES[type];

    if (!target || !queryPredicate || !item?.uid) {
      return null;
    }

    return (
      "/search?dgraph.type=" +
      encodeURIComponent(target.type) +
      "&" +
      encodeURIComponent(queryPredicate) +
      "=" +
      encodeURIComponent(item.uid)
    );
  }

  return (
    <div className="divTable">
      <div className="divTableBody">
        <div className="divTableRow">
          <div className="divTableHead">
            <h3>Other entries referencing this entry:</h3>
          </div>
          <div className="divTableCellSubText">
            Select a number to view the matching entries in search.
          </div>
        </div>

        {summaryEntries.map(([fieldName, value]) => {
          const target = SUMMARY_TARGET_TYPES[fieldName];
          const link = getSummarySearchLink(fieldName);

          return (
            <div className="divTableRow" key={fieldName}>
              <div className="divTableHead">{target?.label ?? fieldName}:</div>
              <div className="divTableCell">
                {link ? <Link to={link}>{value}</Link> : value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailReverseSummary;
