import { kCOMMONWORDS_URL_WWW, kLANG_NAME_CAPITAL } from "../lib/constants";

const SITE_NAME = `Common ${kLANG_NAME_CAPITAL} Words`;

/**
 * JSON-LD is inlined with a <script> tag rather than rendered as JSX text so
 * the markup reaches crawlers in the initial HTML.
 */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide WebSite + Organization graph, rendered once in the root layout. */
export function SiteStructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${kCOMMONWORDS_URL_WWW}/#website`,
            url: kCOMMONWORDS_URL_WWW,
            name: SITE_NAME,
            description: `Study the most frequent ${kLANG_NAME_CAPITAL} words with word lists, flashcards, quizzes, and pronunciation.`,
            inLanguage: "en",
            publisher: { "@id": `${kCOMMONWORDS_URL_WWW}/#organization` },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${kCOMMONWORDS_URL_WWW}/browse?word={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "Organization",
            "@id": `${kCOMMONWORDS_URL_WWW}/#organization`,
            name: "Common Words",
            url: kCOMMONWORDS_URL_WWW,
            logo: `${kCOMMONWORDS_URL_WWW}/common-words-logo.png`,
          },
        ],
      }}
    />
  );
}

/**
 * Marks a word list page as a CollectionPage with breadcrumbs, so search
 * engines can show the list in context rather than as a bare page.
 */
export function WordListStructuredData({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${kCOMMONWORDS_URL_WWW}${path}`;
  const segments = path.split("/").filter(Boolean);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${url}/#page`,
            url,
            name,
            description,
            inLanguage: "en",
            about: {
              "@type": "Language",
              name: kLANG_NAME_CAPITAL,
            },
            isPartOf: { "@id": `${kCOMMONWORDS_URL_WWW}/#website` },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: kCOMMONWORDS_URL_WWW,
              },
              ...segments.map((segment, i) => ({
                "@type": "ListItem",
                position: i + 2,
                name: segment
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" "),
                item: `${kCOMMONWORDS_URL_WWW}/${segments
                  .slice(0, i + 1)
                  .join("/")}`,
              })),
            ],
          },
        ],
      }}
    />
  );
}
