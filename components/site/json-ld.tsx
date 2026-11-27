/** Structured data for search engines, as a JSON-LD script. */
export function JsonLd({ data }: { data: unknown }) {
  // `<` is escaped so text inside the data can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
