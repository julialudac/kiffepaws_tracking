import { DOCS_DIRECTORY_URL } from "./constants";
import { Upload } from "./entities/entitites";
import path from "node:path"

export const getDocumentUrl = (document: Upload) => {
  console.log(document);
  console.log(`${DOCS_DIRECTORY_URL}/${"doc" + document.id}-${document.filename}`);
  return `${DOCS_DIRECTORY_URL}/${document.filename}`;
};

// This function returns the absolute path to the uploads directory on the server.
export const getUploadsDirectory = () => {
  return path.join(process.cwd(), "public", "uploads")
};