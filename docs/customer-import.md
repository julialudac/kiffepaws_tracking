# Customer Import Process

## Context

The application currently does not provide a UI for creating customers.

To accelerate development and migrate data from the existing SaaS, customers are temporarily created through YAML files and a Python import script, *scripts/add_data.py* which can be developed and will be used in different manners, depending on my needs. 

## Input Files

YAML files are stored in:

```txt
data/customer-imports/
```

Example:

```yaml
firstname: Damien
email: damien@example.com

dog:
  name: Vaya
  breed: English Cocker Spaniel

ongoingPackages:
  - type: F15
    passedSessions:
      - date: 2026-02-06
        theme: Rules of life
```

## Import Script

The import script reads YAML files and generates application data.

This workflow is temporary and will eventually be replaced by a dedicated UI.

## Motivation

* Fast migration from the existing SaaS.
* Minimal development effort.
* Allows focusing on core application features first.
