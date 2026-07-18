# Markdown Rendering

## Context

Session reports contain formatted text content.

The goal is to store reports in a human-readable format that is easy to edit, migrate, and maintain.

Markdown was chosen as the storage format because it is:

* readable as plain text;
* easy to version with Git;
* supported by many tools;
* more structured than raw text while being simpler than storing HTML.

---

## Considered Solutions

### 1. Store and render raw HTML with `marked`

The first approach was to convert Markdown content into HTML using `marked`.

Example flow:

```
Markdown
   |
   v
marked.parse()
   |
   v
HTML string
   |
   v
React rendering
```

The generated HTML was rendered using:

```tsx
<div
  dangerouslySetInnerHTML={{
    __html: htmlContent
  }}
/>
```

### Advantages

* Simple implementation.
* Directly produces HTML.
* Good control over the generated markup.

### Drawbacks

* Uses `dangerouslySetInnerHTML`.
* Requires trusting/sanitizing the generated HTML.
* Less aligned with React's component model.
* Harder to customize individual Markdown elements.

This solution was rejected in favor of a React-native rendering approach.

---

## Final Solution: `react-markdown`

The final implementation uses `react-markdown`.

Flow:

```
Markdown
   |
   v
react-markdown
   |
   v
React components
```

Example:

```tsx
<ReactMarkdown>
  {markdownContent}
</ReactMarkdown>
```

### Advantages

* No direct HTML injection.
* Better integration with React.
* Easier customization of Markdown elements.
* Safer default behavior.

---

## Styling

Because Tailwind CSS resets default HTML styles, Markdown elements such as:

* `h1`
* `h2`
* `ul`
* `blockquote`

do not automatically look like formatted documents.

The Tailwind Typography plugin was added:

```css
@plugin "@tailwindcss/typography";
```

and Markdown content is wrapped with:

```tsx
<div className="prose">
  <ReactMarkdown>
    {markdownContent}
  </ReactMarkdown>
</div>
```

This provides document-like styling.

---

## Final Decision

Markdown content is stored as Markdown and rendered through `react-markdown` with Tailwind Typography styling.

This approach provides:

* easy editing;
* good readability;
* React compatibility;
* safer rendering;
* future flexibility.
