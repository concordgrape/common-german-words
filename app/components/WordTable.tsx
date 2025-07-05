"use client";

import React, { useState, useEffect, useRef } from 'react';
import SortButton, { SortOption } from './SortButtons/Sort';
import { Virtuoso } from 'react-virtuoso';
import { Word } from '../helpers/fetchBasicWordList';

// WordTable component props interface
interface WordTableProps {
  onRowClick: (word: Word) => void;
  selectedWord?: Word | null;
  words: Word[]
}

// WordTable component
export const WordTable: React.FC<WordTableProps> = ({ onRowClick, selectedWord, words }) => {
  // State for search term, explicitly typed as string
  const [searchTerm, setSearchTerm] = useState<string>('');
  // State for sorting, 'asc' or 'desc', explicitly typed
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // State to manage expanded rows, explicitly typed to an array of numbers
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  // State to detect if the current view is mobile
  //const [isMobile, setIsMobile] = useState<boolean>(false);
  // State to manage the visibility of the sort dropdown
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

  // Create a ref for the dropdown container
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Record<number, HTMLDivElement | null>>({});

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


  // Filter words based on search term
  const filteredWords = words.filter((word: Word) =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort words based on term and current sort order
  const sortedWords = [...filteredWords].sort((a: Word, b: Word) => {
    if (sortOrder === 'asc') {
      return a.word.localeCompare(b.word);
    } else {
      return b.word.localeCompare(a.word);
    }
  });



  // Toggle expanded row by ID and pass clicked word to parent
const toggleRow = (word: Word) => {
  onRowClick(word); // Notify parent

  setExpandedRows((prevExpandedRows) =>
    prevExpandedRows[0] === word.id ? [] : [word.id]
  );
};


    const sortOptions: SortOption[] = [
    { id: 'frequency', label: 'by frequency' },
    { id: 'alphabetically', label: 'alphabetically' },
    { id: 'date-saved', label: 'date saved' },
    { id: 'next-review', label: 'next review' },
  ];

    const [activeSort, setActiveSort] = useState<SortOption['id']>('alphabetically'); // 'alphabetically' is active by default as per screenshot

  // Type for the handler function
  const handleSortChange = (optionId: SortOption['id']) => {
    setActiveSort(optionId);
    // In a real application, you would trigger a data sort here
    console.log(`Sorting by: ${optionId}`);
  };

  // Function to handle sorting
  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setShowSortDropdown(false); // Close the dropdown after selection
  };

  return (
    <div className={`w-full p-1 sm:p-4 md:p-4 items-start bg-[#FFFFFF] rounded-lg overflow-hidden mt-5`}>
        {/* Header with Search and Sort border border-1 border-[#B1B1B1]*/}
        <div className="p-4">
            {/* Search Input */}
            <div className="relative flex items-center w-full mb-4">
                <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F2F2F2] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
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
            
            {/* Sort Icon and Dropdown */}
            <div className="flex justify-start" ref={sortDropdownRef}>
                <div className="relative">
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="p-2 rounded-full bg-black/10 hover:bg-black/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        aria-label="Sort">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 9.414V17a1 1 0 01-1.293.956l-2-1A1 1 0 017 15V9.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {showSortDropdown && (
                        <div className="absolute left-0 mt-2 w-42 bg-[#F2F2F2] rounded-md shadow-lg z-10 pt-2 pb-2 text-gray-700">
                            <button
                                onClick={() => handleSort('asc')}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-black/20"
                            >
                                Alphabetically A-Z
                            </button>
                            <hr className="text-sm text-gray-600" />
                            <button
                                onClick={() => handleSort('desc')}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-black/20"
                            >
                                Alphabetically Z-A
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

      {/* Table Rows */}
      <Virtuoso
        style={{ height: '200vh', overflow: 'scroll' }} // Adjust height
        totalCount={sortedWords.length}
        data={sortedWords}
        itemContent={(index, word: Word) => (
            <div
            key={word.id}
            ref={(el) => {
                wordRefs.current[word.id] = el;
            }}
            className={`group border-1 mb-1 rounded-md ${expandedRows.includes(word.id) ? 'border-blue-300' : 'border-[#F2F2F2]'}`}
            >
            <div
              className={`flex items-center justify-between p-3 cursor-pointer transition-colors duration-200 ${expandedRows.includes(word.id) ? '' : 'hover:bg-gray-100'}`}
              onClick={() => toggleRow(word)}
            >
              {/* Status Indicator */}
              <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
              {/* Word Term */}
              <div className="flex-1 text-left font-medium">{word.word}</div>
              {/* Word Type */}
              <div className="flex-none text-gray-400 text-sm mr-4">{word.part_of_speech}</div>
              {/* Tags 
              <div className="flex-none flex items-center space-x-2 mr-4">
                {word.tags.map((tag: string) => (
                  <span key={tag} className="bg-blue-600 text-gray-200 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>*/}
              {/* Expand/Collapse Icon */}
              <button
                className="p-1 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label={expandedRows.includes(word.id) ? "Collapse" : "Expand"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${expandedRows.includes(word.id) ? '-rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div
                className={`transition-max-height overflow-hidden bg-[#027AFB] rounded-b-sm text-white visible sm:hidden md:hidden
                    ${expandedRows.includes(word.id) ? 'max-h-40 opacity-100 p-4' : 'max-h-0 opacity-0 p-0'}`}
                >
                <p>Details for &quot;{word.word}&quot; would go here.</p>
            </div>
          </div>
        )} />
    </div>
  );
};