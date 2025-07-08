"use client";

import React, { useState, useEffect, useRef } from 'react';
import SortButton, { SortOption } from './SortButtons/Sort';
import { Virtuoso } from 'react-virtuoso';
import { Word } from '../helpers/fetchBasicWordList';
import { useSearchParams, useRouter } from "next/navigation";
import { useIsMobile } from '../helpers/utils';
import {DropdownWordInfo} from './DropdownWordInfo';

// WordTable component props interface
interface WordTableProps {
  onRowClick: (word: Word | null) => void;
  selectedWord?: Word | null;
  words: Word[];
}

const ITEMS_PER_PAGE = 100;

// WordTable component
export const WordTable: React.FC<WordTableProps> = ({ onRowClick, selectedWord, words }) => {
  // State to manage expanded rows, explicitly typed to an array of numbers
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  // State to detect if the current view is mobile
  //const [isMobile, setIsMobile] = useState<boolean>(false);
  // State to manage the visibility of the sort dropdown
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

      const [activeSort, setActiveSort] = useState<SortOption['id']>('frequency'); // 'alphabetically' is active by default as per screenshot


  // Create a ref for the dropdown container
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Record<number, HTMLDivElement | null>>({});

const searchParams = useSearchParams();
const router = useRouter();

const initialSearch = searchParams.get("search") || "";
const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };
// Reset to page 1 when the search term changes
useEffect(() => {
  if (searchTerm) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }
}, [searchTerm]);


useEffect(() => {
  if (selectedWord) {
    setExpandedRows([selectedWord.id]);

    const ref = wordRefs.current[selectedWord.id];
    if (ref) {
      const bounding = ref.getBoundingClientRect();
const fullyInView =
  bounding.top >= 0 &&
  bounding.bottom <= window.innerHeight;

const partiallyInView =
  bounding.top < window.innerHeight && bounding.bottom >= 0;

if (!partiallyInView && fullyInView) {
  ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

    }
  } else {
   // setExpandedRows([words[0].id]);
  }
}, [selectedWord]);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is open and the click is outside the dropdown ref
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or showSortDropdown changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]); // Re-run effect when showSortDropdown changes

  useEffect(() => {
  if (selectedWord && !expandedRows.includes(selectedWord.id)) {
    setExpandedRows([selectedWord.id]);
  }
}, [selectedWord]);

const scoredWords = words
  .map((word) => {
    const lowerWord = word.word.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    let score = 0;

    if (lowerWord === lowerSearch) {
      score = 3; // exact match
    } else if (lowerWord.startsWith(lowerSearch)) {
      score = 2; // prefix match
    } else if (lowerWord.includes(lowerSearch)) {
      score = 1; // substring match
    }

    return { ...word, _score: score };
  })
  .filter((word) => word._score > 0);

// Then sort by relevance score first, then by word
const sortedWords = scoredWords.sort((a, b) => {
  if (activeSort === 'frequency') {
    return b.frequency - a.frequency; // High to low frequency
  } else {
    return a.word.localeCompare(b.word);
  }
});



const totalPages = Math.ceil(sortedWords.length / ITEMS_PER_PAGE);


// Only show paginated results if not filtering
const displayedWords = sortedWords.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);


// Adjust Virtuoso height
const rowHeight = 54;
const isMobile = useIsMobile(); 
//const virtuosoHeight = `${displayedWords.length * rowHeight + (isMobile ? 1000 : 0)}px`;
const virtuosoHeight = `${displayedWords.length * rowHeight}px`;


  // Toggle expanded row by ID and pass clicked word to parent
const toggleRow = (word: Word) => {
  const params = new URLSearchParams(window.location.search);

  const isCurrentlyExpanded = expandedRows.includes(word.id);

  if (isCurrentlyExpanded && isMobile) {
    // Collapse this row
    setExpandedRows([]);
    params.delete("word");
    onRowClick(null); // also clear selectedWord if needed
  } else {
    // Expand this row
    setExpandedRows([word.id]);
    params.set("word", word.word);
    onRowClick(word);
  }

  window.history.pushState({}, "", `?${params.toString()}`);
};




    const sortOptions: SortOption[] = [
    { id: 'frequency', label: 'by frequency' },
    { id: 'alphabetically', label: 'alphabetically' },
    { id: 'date-saved', label: 'date saved' },
    { id: 'next-review', label: 'next review' },
  ];


  // Type for the handler function
  const handleSortChange = (optionId: SortOption['id']) => {
    setActiveSort(optionId);
    // In a real application, you would trigger a data sort here
    console.log(`Sorting by: ${optionId}`);
  };

const handleSearchChange = (value: string) => {
  const params = new URLSearchParams(window.location.search);

  if (value.trim() === "") {
    params.delete("search");
  } else {
    params.set("search", value);
    params.set("page", "1");
  }

  window.history.pushState({}, "", `?${params.toString()}`);
  setSearchTerm(value);
};




  const CustomScroller = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} {...props} />
));
CustomScroller.displayName = "CustomScroller";


  return (
    <div className={`w-full max-w-[800px] p-1 sm:p-4 md:p-4 items-start bg-[#FFFFFF] rounded-lg overflow-hidden mt-5`}>
        {/* Header with Search and Sort border border-1 border-[#B1B1B1]*/}
        <div className="p-4">
  <div className="flex justify-between items-center mb-4">
<button
  onClick={() => changePage(currentPage - 1)}
  disabled={currentPage <= 1}
  className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
>
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
    />
  </svg>
  Previous
</button>

    <span className="text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
<button
  onClick={() => changePage(currentPage + 1)}
  disabled={currentPage >= totalPages}
  className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
>
  Next
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
    />
  </svg>
</button>

  </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full mb-4">
                <input
  type="text"
  placeholder="Search..."
  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F2F2F2] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={searchTerm}
  onChange={(e) => handleSearchChange(e.target.value)}
/>
{searchTerm && (
  <button
    onClick={() => handleSearchChange("")}
    className="absolute right-3 text-gray-400 hover:text-gray-600 w-10 h-10"
    aria-label="Clear"
  >
    &times;
  </button>
)}

                <span className="absolute left-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                </span>
            </div>

            {/* Sort Buttons Row */}
            <div className="grid grid-cols-2 gap-0 mb-4 max-w-[300px]">
                {sortOptions.map((option, index) => (
                <SortButton
                    key={option.id}
                    label={option.label}
                    isActive={activeSort === option.id}
                    onClick={() => handleSortChange(option.id)}
                    index={index}
                />
                ))}
            </div>
        </div>
        <div className="text-left mb-5">{sortedWords.length} words loaded</div>
        <div className="flex px-4 py-2 bg-[#F9F9F9] text-gray-600 font-semibold border-b border-gray-200 text-sm">
          <div className="w-2 mr-2"></div>
          <div className="w-5">#</div>
          <div className="flex-1">Word</div>
          <div className="w-[40px] text-center">Rank</div>
          <div className="w-[80px] text-right">Type</div>
          <div className="w-5 ml-5"></div>
        </div>
{(displayedWords.length === 0 && searchTerm) && (
  <div>
    <h1 className='mt-5 mb-2'>{`'${searchTerm}' not found, example words:`}</h1>
           <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm">haus</button>
           <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm ml-2">gehen</button>
                      <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm ml-2">das</button>

  </div>
)}
      {/* Table Rows */}
      {(displayedWords.length === 0 && words.length === 0) ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
  </div>
) : (
  <Virtuoso
  data={displayedWords}
  style={{ height: virtuosoHeight }}
  components={{
    Scroller: CustomScroller,
  }}
  itemContent={(index, word) => (
    <div
      key={word.id}
      ref={(el) => {
        wordRefs.current[word.id] = el;
      }}
      className={`group border-1 ${
        expandedRows.includes(word.id) ? "border-blue-300" : "border-[#F2F2F2]"
      }`}
    >
      <div
        className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-200 ${
          expandedRows.includes(word.id) ? "" : "hover:bg-gray-100"
        }`}
        onClick={() => toggleRow(word)}
      >
        {/* Status Indicator */}
        <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
                <span className="mr-3 text-gray-400">{index}</span>

        {/* Word Term */}
        <div className="flex-1 text-left font-medium">{word.word}</div>

<div className="w-[40px] text-center text-gray-400 text-sm mr-3">{word.rank}</div>

        {/* Word Type */}
<div className="w-[80px] text-right text-gray-400 text-sm mr-4">
  {word.part_of_speech}
</div>


        {/* Expand/Collapse Icon */}
        <button
          className="p-1 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label={expandedRows.includes(word.id) ? "Collapse" : "Expand"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
              expandedRows.includes(word.id) ? "-rotate-90" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={`transition-max-height overflow-hidden bg-[#027AFB] text-white visible sm:hidden md:hidden ${
          expandedRows.includes(word.id)
            ? "opacity-100 p-4"
            : "opacity-0 p-0"
        }`}
      >
<DropdownWordInfo word={word} isOpen={expandedRows.includes(word.id)} />
      </div>
    </div>
  )}
/>
)}

    </div>
  );
};