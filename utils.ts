import { DOCS_DIRECTORY_URL } from "./constants";
import { Upload } from "./entities/entitites";

export const getDocumentUrl = (document: Upload) => {
  console.log(document);
  console.log(`${DOCS_DIRECTORY_URL}/${"doc" + document.id}-${document.filename}`);
  return `${DOCS_DIRECTORY_URL}/${document.filename}`;
};