import React, { useEffect, useState, useRef } from 'react';
import JSZip from 'jszip'; // This library is used to unzip the EPUB file

interface ChapterPage {
  id: string;
  title: string;
  htmlContent: string;
}

const EPubReader: React.FC = () => {
  // State to store the parsed HTML content of each chapter as an array of pages
  const [bookPages, setBookPages] = useState<ChapterPage[]>([]);
  // State to manage the currently displayed page index
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);
  // State to control the visibility of the chapter navigation popup
  const [showChapterPopup, setShowChapterPopup] = useState<boolean>(false);

  // States for tooltip functionality
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipX, setTooltipX] = useState<number>(0);
  const [tooltipY, setTooltipY] = useState<number>(0);

  // Ref for the main content area to attach event listeners for delegation
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Utility function to process HTML content and wrap individual words
   * in <span> tags. This allows us to attach event listeners via delegation.
   * @param htmlString The raw HTML content of a chapter.
   * @returns A new HTML string with words wrapped in interactive spans.
   */
  const processHtmlForWords = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Recursive function to traverse the DOM and wrap text nodes
    const wrapWordsInElement = (node: Node) => {
      // Process only text nodes that are not empty
      if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
        // Split text by whitespace, preserving whitespace as separate parts
        const wordsAndSpaces = node.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        wordsAndSpaces.forEach(part => {
          if (part.trim() === '') {
            // If it's just whitespace, append as a text node
            fragment.appendChild(document.createTextNode(part));
          } else {
            // If it's a word, wrap it in a span
            const span = document.createElement('span');
            span.textContent = part;
            // Add a class to identify interactive words for event delegation
            span.className = 'word-interactive cursor-pointer';
            // Store the word itself in a data attribute for easy retrieval
            span.setAttribute('data-word', part);
            fragment.appendChild(span);
          }
        });
        // Replace the original text node with the new fragment containing spans and text nodes
        node.parentNode?.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively call for child nodes of element nodes
        Array.from(node.childNodes).forEach(wrapWordsInElement);
      }
    };

    // Start processing from the body of the parsed document
    if (doc.body) {
      Array.from(doc.body.childNodes).forEach(wrapWordsInElement);
    } else {
      // Fallback for documents without a body element (e.g., HTML fragments)
      Array.from(doc.documentElement.childNodes).forEach(wrapWordsInElement);
    }

    // Return the innerHTML of the modified body (or documentElement)
    return doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;
  };

  useEffect(() => {
    /**
     * Asynchronously loads and parses the EPUB file.
     * It fetches the file, unzips it, finds the OPF file,
     * extracts spine items, and then reads and sanitizes
     * the HTML content of each chapter, storing each as a separate page.
     */
    const loadEpub = async () => {
      try {
        setLoading(true); // Set loading to true at the start of the process
        setError(null);   // Clear any previous errors
        setBookPages([]); // Clear previous book pages
        setCurrentPageIndex(0); // Reset to the first page

        // 1. Fetch the EPUB file from the public directory
        const response = await fetch('/alice.epub');
        if (!response.ok) {
          // If the fetch request fails, throw an error
          throw new Error(`HTTP error! Status: ${response.status}. Please ensure 'alice.epub' is in your public folder.`);
        }
        // Get the file content as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // 2. Load the ArrayBuffer into JSZip to decompress the EPUB
        const zip = await JSZip.loadAsync(arrayBuffer);

        // 3. Find 'META-INF/container.xml' to get the path to the OPF file
        const containerFile = zip.file('META-INF/container.xml');
        if (!containerFile) {
          throw new Error('container.xml not found in EPUB. This file is essential for EPUB structure.');
        }
        const containerXmlString = await containerFile.async('text');
        // Parse the XML string to a DOM document
        const containerDoc = new DOMParser().parseFromString(containerXmlString, 'application/xml');
        // Extract the 'full-path' attribute which points to the OPF file
        const opfPathElement = containerDoc.querySelector('rootfile');
        const opfPath = opfPathElement?.getAttribute('full-path');

        if (!opfPath) {
          throw new Error('OPF file path not found in container.xml. Cannot determine book content.');
        }

        // 4. Find and parse the OPF (Open Packaging Format) file
        const opfFile = zip.file(opfPath);
        if (!opfFile) {
          throw new Error(`OPF file not found at ${opfPath}.`);
        }
        const opfXmlString = await opfFile.async('text');
        const opfDoc = new DOMParser().parseFromString(opfXmlString, 'application/xml');

        // Determine the base path for resolving relative paths within the OPF directory
        const opfBasePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

        // 5. Parse the manifest (list of all files) and spine (reading order) from the OPF
        const manifestItems: { [id: string]: { href: string; mediaType: string } } = {};
        opfDoc.querySelectorAll('manifest item').forEach(item => {
          const id = item.getAttribute('id');
          const href = item.getAttribute('href');
          const mediaType = item.getAttribute('media-type');
          if (id && href && mediaType) {
            manifestItems[id] = { href, mediaType };
          }
        });

        const spineItemRefs: string[] = [];
        opfDoc.querySelectorAll('spine itemref').forEach(itemref => {
          const idref = itemref.getAttribute('idref');
          if (idref) {
            spineItemRefs.push(idref);
          }
        });

        const newBookPages: ChapterPage[] = []; // Accumulator for all chapter pages

        // 6. Iterate through spine items, extract HTML, and sanitize
        for (let i = 0; i < spineItemRefs.length; i++) {
          const idref = spineItemRefs[i];
          const item = manifestItems[idref];
          // Only process XHTML content (the actual book chapters)
          if (item && item.mediaType === 'application/xhtml+xml') {
            // Construct the full path to the chapter file
            const chapterPath = opfBasePath + item.href;
            const chapterFile = zip.file(chapterPath);

            if (chapterFile) {
              const chapterHtml = await chapterFile.async('text');

              // Basic HTML Sanitization:
              // Create a temporary DOM to parse and manipulate the chapter HTML
              const parser = new DOMParser();
              const doc = parser.parseFromString(chapterHtml, 'text/html');

              // Remove all <script> tags to prevent execution of arbitrary JavaScript
              doc.querySelectorAll('script').forEach(script => script.remove());

              // Remove all 'on*' attributes (e.g., onclick, onload) from all elements
              doc.querySelectorAll('*').forEach(element => {
                Array.from(element.attributes).forEach(attr => {
                  if (attr.name.startsWith('on')) {
                    element.removeAttribute(attr.name);
                  }
                });
              });

              // Extract the inner HTML of the <body> or the whole document if no body exists
              const bodyContent = doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;

              // Try to extract a title from the chapter HTML (e.g., from h1 or title tag)
              const chapterTitleElement = doc.querySelector('h1, h2, h3, title');
              const chapterTitle = chapterTitleElement ? chapterTitleElement.textContent?.trim() : `Chapter ${i + 1}`;

              // Process the chapter HTML to wrap words for tooltip functionality
              const processedHtml = processHtmlForWords(bodyContent);

              // Store each chapter as a separate page
              newBookPages.push({
                id: `chapter-${idref}`,
                title: chapterTitle || `Chapter ${i + 1}`,
                htmlContent: processedHtml, // Store the processed HTML
              });
            }
          }
        }
        setBookPages(newBookPages); // Update state with the parsed book pages
      } catch (err) {
        console.error('Failed to load EPUB:', err);
        setError(`Failed to load EPUB: ${err}`); // Set error message
      } finally {
        setLoading(false); // Set loading to false once the process is complete (or an error occurs)
      }
    };

    loadEpub(); // Call the async function to load the EPUB when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  /**
   * Handles navigation to the previous page.
   */
  const goToPreviousPage = () => {
    setCurrentPageIndex(prevIndex => Math.max(0, prevIndex - 1));
    setTooltipVisible(false); // Hide tooltip on page change
  };

  /**
   * Handles navigation to the next page.
   */
  const goToNextPage = () => {
    setCurrentPageIndex(prevIndex => Math.min(bookPages.length - 1, prevIndex + 1));
    setTooltipVisible(false); // Hide tooltip on page change
  };

  /**
   * Handles jumping to a specific chapter (page) from the navigation links.
   * @param chapterId The ID of the chapter to navigate to.
   */
  const goToChapter = (chapterId: string) => {
    const index = bookPages.findIndex(page => page.id === chapterId);
    if (index !== -1) {
      setCurrentPageIndex(index);
      setShowChapterPopup(false); // Close the popup after selecting a chapter
      setTooltipVisible(false); // Hide tooltip on chapter change
    }
  };

  /**
   * Handles mouse over event for words to display tooltip.
   * Uses event delegation on the parent contentRef.
   */
  const handleWordMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
   /* const target = event.target as HTMLElement;
    // Check if the hovered element is one of our interactive word spans
    if (target.classList.contains('word-interactive')) {
      const word = target.getAttribute('data-word');
      if (word) {
        setTooltipContent(word);
        setTooltipX(event.clientX + 10); // Offset tooltip slightly to the right
        setTooltipY(event.clientY + 10); // Offset tooltip slightly downwards
        setTooltipVisible(true);
      }
    }*/
   console.log(event)
  };

  /**
   * Handles mouse out event to hide tooltip.
   * Uses event delegation on the parent contentRef.
   */
  const handleWordMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // Only hide if the mouse is leaving an interactive word
    if (target.classList.contains('word-interactive')) {
      setTooltipVisible(false);
    }
  };

  /**
   * Handles click event for words to display tooltip (or perform other actions).
   * For now, it behaves similarly to hover, but can be extended.
   * Uses event delegation on the parent contentRef.
   */
  const handleWordClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('word-interactive')) {
      const word = target.getAttribute('data-word');
      if (word) {
        // For click, we can make the tooltip more persistent if needed,
        // but for this example, it just ensures visibility on click.
        setTooltipContent(word);
        setTooltipX(event.clientX + 10);
        setTooltipY(event.clientY + 10);
        setTooltipVisible(true);
      }
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
        <div className="text-lg text-gray-700">Loading EPUB...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 font-inter">
        <div className="text-lg text-red-700 p-4 rounded-md border border-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  // Determine if previous/next buttons should be disabled
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === bookPages.length - 1;

  // Get the current page's content
  const currentPage = bookPages[currentPageIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-inter flex flex-col items-center relative"> {/* Added relative for tooltip positioning */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">EPUB Reader (Alice&apos;s Adventures in Wonderland)</h1>

      {/* Chapter Navigation Button */}
      <button
        onClick={() => setShowChapterPopup(true)}
        className="mb-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
      >
        Table of Contents
      </button>

      {/* Chapter Navigation Popup (Modal) */}
      {showChapterPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowChapterPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chapters</h2>
            <ul>
              {bookPages.map((page, index) => (
                <li key={page.id} className="mb-2">
                  <button
                    onClick={() => goToChapter(page.id)}
                    className={`text-blue-600 hover:text-blue-800 hover:underline text-left w-full py-2 px-3 rounded-md transition-colors duration-200
                      ${index === currentPageIndex ? 'font-bold bg-blue-100' : ''}`}
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Book Content Area */}
      <div className="flex-1 max-w-3xl mx-auto flex flex-col">
        {/* Page Content */}
        <div
          ref={contentRef} // Attach ref for event delegation
          onMouseOver={handleWordMouseOver}
          onMouseOut={handleWordMouseOut}
          onClick={handleWordClick}
          className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto mb-6 min-h-[400px]"
        >
          {currentPage ? (
            <div
              className="epub-content text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentPage.htmlContent }}
            />
          ) : (
            <p className="text-center text-gray-600">No content available for this page.</p>
          )}
        </div>

        {/* Tooltip */}
        {tooltipVisible && (
          <div
            style={{ left: tooltipX, top: tooltipY }}
            className="fixed bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg z-50 pointer-events-none"
          >
            {tooltipContent}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-4 w-full">
          <button
            onClick={goToPreviousPage}
            disabled={isFirstPage}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${isFirstPage ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}`}
          >
            &larr; Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPageIndex + 1} of {bookPages.length}
          </span>
          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${isLastPage ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}`}
          >
            Next &rarr;
          </button>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Note: This reader extracts raw HTML content. Full styling, fonts, and image rendering from the original EPUB might be limited as it&apos;s not using a dedicated EPUB rendering engine (which typically uses iframes for isolation and full fidelity).
        </p>
      </div>
    </div>
  );
};

export default EPubReader;
