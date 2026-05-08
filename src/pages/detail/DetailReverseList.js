// Some entry types support /view/reverse/:uid for incoming relationships.
// These are mostly concrete resource/entity entries such as Tool, Dataset,
// NewsSource, PoliticalParty, Organization, Author, FileFormat,
// ConceptVariable, and similar types.
//
// The reverse endpoint returns full lists of entries grouped by keys like
// <predicate>__<dgraphtype>s, for example sources_included__datasets.
//
// This component renders those full reverse relationship lists as a
// Referenced By section.

import React from "react";
import { Link } from "react-router-dom";

const REVERSE_KEY_LABELS = {
  authors__archives: "Archives by this author",
  authors__datasets: "Datasets by this author",
  authors__learningmaterials: "Learning materials by this author",
  authors__scientificpublications: "Publications by this author",
  authors__tools: "Tools by this author",

  owns__organizations: "Organizations that own this entry",
  owns__persons: "People that own this entry",

  publishes__organizations: "Organizations publishing this entry",
  publishes__persons: "People publishing this entry",
  publishes__politicalpartys: "Political parties publishing this entry",

  entries_included__collections: "Collections including this entry",

  initial_source__datasets: "Datasets derived from this entry",

  file_formats__archives: "Archives using this file format",
  file_formats__datasets: "Datasets using this file format",
  file_formats__files: "Files using this file format",

  input_file_format__tools: "Tools using this as input format",
  output_file_format__tools: "Tools using this as output format",

  tools__collections: "Collections using this tool",
  tools__learningmaterials: "Learning materials using this tool",
  tools__scientificpublications: "Publications using this tool",

  datasets_used__learningmaterials: "Learning materials using this dataset",
  datasets_used__scientificpublications: "Publications using this dataset",

  references__collections: "Collections referencing this entry",
  related_publications__datasets: "Datasets related to this publication",

  validation_dataset__tools: "Tools validated with this dataset",

  concept_variables__archives: "Archives using this concept",
  concept_variables__collections: "Collections using this concept",
  concept_variables__datasets: "Datasets using this concept",
  concept_variables__learningmaterials: "Learning materials using this concept",
  concept_variables__scientificpublications: "Publications using this concept",
  concept_variables__tools: "Tools using this concept",

  meta_variables__archives: "Archives using this meta variable",
  meta_variables__datasets: "Datasets using this meta variable",

  text_units__archives: "Archives using this text unit",
  text_units__datasets: "Datasets using this text unit",
  text_units__scientificpublications: "Publications using this text unit",

  sources_included__archives: "Archives including this source",
  sources_included__datasets: "Datasets including this source",
  sources_included__journalisticbrands:
    "Journalistic brands including this source",
  sources_included__scientificpublications:
    "Publications including this source",

  designed_for__tools: "Tools designed for this entry",
  materials__collections: "Collections including this learning material",
};

// const REVERSE_KEY_LABELS = {
//   authors__archives: "Archives",
//   authors__datasets: "Datasets",
//   authors__learningmaterials: "Learning Materials",
//   authors__scientificpublications: "Publications",
//   authors__tools: "Tools",

//   owns__organizations: "Owned by",
//   owns__persons: "Owned by",

//   publishes__organizations: "Published by Organizations",
//   publishes__persons: "Published by People",
//   publishes__politicalpartys: "Published by Political Parties",

//   entries_included__collections: "Collections",

//   initial_source__datasets: "Initial Source",

//   file_formats__archives: "Archives",
//   file_formats__datasets: "Datasets",
//   file_formats__files: "Files",

//   input_file_format__tools: "Tools",
//   output_file_format__tools: "Tools",

//   tools__collections: "Collections",
//   tools__learningmaterials: "Learning Materials",
//   tools__scientificpublications: "Research",

//   datasets_used__learningmaterials: "Learning Materials",
//   datasets_used__scientificpublications: "Research",

//   references__collections: "Collections",
//   related_publications__datasets: "Datasets",

//   validation_dataset__tools: "Tools",

//   concept_variables__archives: "Archives",
//   concept_variables__collections: "Collections",
//   concept_variables__datasets: "Datasets",
//   concept_variables__learningmaterials: "Learning Materials",
//   concept_variables__scientificpublications: "Research",
//   concept_variables__tools: "Tools",

//   meta_variables__archives: "Archives",
//   meta_variables__datasets: "Datasets",

//   text_units__archives: "Archives",
//   text_units__datasets: "Datasets",
//   text_units__scientificpublications: "Research",

//   sources_included__archives: "Archives",
//   sources_included__datasets: "Datasets",
//   sources_included__journalisticbrands: "Journalistic Brands",
//   sources_included__scientificpublications: "Research",

//   designed_for__tools: "Tools",
//   materials__collections: "Collections",
// };

const REVERSE_PREDICATE_LABELS = {
  authors: "Authors",
  channels: "Channels",
  concept_variables: "Concept Variables",
  datasets_used: "Datasets",
  designed_for: "Tools",
  entries_included: "Collections",
  file_formats: "File Formats",
  initial_source: "Initial Source",
  input_file_format: "Input File Format",
  materials: "Learning Materials",
  meta_variables: "Meta Variables",
  methodologies: "Methodologies",
  modalities: "Modalities",
  output_file_format: "Output File Format",
  owns: "Owned by",
  programming_languages: "Programming Languages",
  publishes: "Published by",
  references: "References",
  related_publications: "Related Publications",
  sources_included: "Sources Included",
  text_units: "Text Units",
  tools: "Tools",
  validation_dataset: "Validation Dataset",
};

function getReverseLabel(reverseKey) {
  if (REVERSE_KEY_LABELS[reverseKey]) {
    return REVERSE_KEY_LABELS[reverseKey];
  }

  const [rawPredicate] = reverseKey.split("__");

  return REVERSE_PREDICATE_LABELS[rawPredicate] ?? rawPredicate;
}

function renderReverseEntry(entry) {
  if (!entry?.name) {
    return <pre>{JSON.stringify(entry, null, 2)}</pre>;
  }

  const detailId = entry._unique_name ?? entry.uid;

  if (!detailId) {
    return entry.name;
  }

  return <Link to={`/detail-new/${detailId}`}>{entry.name}</Link>;
}

function renderReverseEntries(entries) {
  return entries.map((entry, index) => (
    <div key={entry.uid ?? `${entry.name}-${index}`}>
      {renderReverseEntry(entry)}
    </div>
  ));
}

const DetailReverseList = ({ reverseEntries }) => {
  if (reverseEntries.length === 0) {
    return null;
  }

  return (
    <div className="divTable">
      <div className="divTableBody">
        <div className="divTableRow">
          <div className="divTableHead">
            <h3>Other entries referencing this entry:</h3>
          </div>
        </div>

        {reverseEntries.map(([predicate, entries]) => (
          <div className="divTableRow" key={predicate}>
            <div className="divTableHead">{getReverseLabel(predicate)}:</div>
            <div className="divTableCell">{renderReverseEntries(entries)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailReverseList;
