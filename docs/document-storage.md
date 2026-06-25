# Document Storage

Date: 25/06/26

## Overview

Documents attached to business entities (e.g. customers) are stored as physical files in the application's `public/uploads` directory.

The database (or mocked JSON data) stores only document metadata, not the file content itself.

## Document Entity

```ts
type Document = {
  id: string;
  name: string;
  filename: string;
};
```

### Fields

* `id`: unique technical identifier.
* `name`: human-readable document name displayed in the UI.
* `filename`: physical filename used for storage.

## Storage Location

Files are stored under:

```txt
public/uploads/
```

using the following naming convention:

```txt
doc{documentId}-{safeFilename}
```

Example:

```txt
public/uploads/doc123-bilan-comportemental.pdf
```

## Public Access

Files are publicly accessible through:

```txt
/uploads/{filename}
```

Example:

```txt
/uploads/doc123-bilan-comportemental.pdf
```

The frontend generates the URL dynamically from the document metadata.

## Motivation

This approach was chosen because:

* It is simple to implement.
* It works well with local development and mocked JSON data.
* It avoids introducing cloud storage complexity too early.
* It supports future migration to PostgreSQL.
* It prevents filename collisions through unique document identifiers.

## Future Evolution

Possible future improvements:

* Dedicated `Document` table in PostgreSQL.
* Cloud storage (S3, Supabase Storage, etc.).
* Document versioning.
* Access control and permissions.
* File metadata (size, MIME type, upload date).

The current implementation intentionally favors simplicity and rapid development over advanced storage architecture.
