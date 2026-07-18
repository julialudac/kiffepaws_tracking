## Derived data: customer last activity date

### Context

The customer list displays a "last update" date.

This date represents the latest meaningful activity with a customer (currently the latest session date).

### Considered approaches

#### Store `lastActivityAt` on Customer

The value would be updated whenever a new session is created.

Pros:
- Fast lookup.
- Simple frontend access.

Cons:
- Risk of inconsistency.
- Requires synchronization when sessions are modified or deleted.

#### Compute from sessions

The value is calculated from related sessions:


Customer
└── Packages
└── Sessions
└── max(date)


Pros:
- Always consistent.
- No duplicated data.

Cons:
- Requires computation.

### Decision

For now, the value is computed when building the CustomerView.

The amount of data is small, so the performance impact is negligible.

If scaling becomes an issue, a stored `lastActivityAt` field can be introduced later.