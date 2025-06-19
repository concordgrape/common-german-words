"use client";

import React, { useState, useEffect, useRef } from 'react';

// Define the interface for a Word object
export interface Word {
  id: number;
  term: string;
  type: string;
  tags: string[];
}

// WordTable component props interface
interface WordTableProps {
  onRowClick: (word: Word) => void;
}

// WordTable component
export const WordTable: React.FC<WordTableProps> = ({ onRowClick }) => {
  // Sample data for the table, explicitly typed as an array of Word objects
 /* const [words, setWords] = useState<Word[]>([
    { id: 1, term: 'produce', type: 'verb', tags: ['cause', 'make'] },
    { id: 2, term: 'make', type: 'verb', tags: ['produce', 'do'] },
    { id: 3, term: 'establish', type: 'verb', tags: ['start', 'develop'] },
    { id: 4, term: 'build', type: 'verb', tags: ['produce', 'assemble'] },
    { id: 5, term: 'generate', type: 'verb', tags: ['cause', 'make'] },
    { id: 6, term: 'form', type: 'verb', tags: ['produce', 'build'] },
    { id: 7, term: 'construct', type: 'verb', tags: ['build', 'form'] },
    { id: 8, term: 'cause', type: 'verb', tags: ['make', 'work'] },
    { id: 9, term: 'originate', type: 'verb', tags: ['make', 'start'] },
    { id: 10, term: 'set up', type: 'verb', tags: ['start', 'establish'] },
  ]);
*/
  const words = [
    { id: 1, term: 'produce', type: 'verb', tags: ['cause', 'make'] },
    { id: 2, term: 'make', type: 'verb', tags: ['produce', 'do'] },
    { id: 3, term: 'establish', type: 'verb', tags: ['start', 'develop'] },
    { id: 4, term: 'build', type: 'verb', tags: ['produce', 'assemble'] },
    { id: 5, term: 'generate', type: 'verb', tags: ['cause', 'make'] },
    { id: 6, term: 'form', type: 'verb', tags: ['produce', 'build'] },
    { id: 7, term: 'construct', type: 'verb', tags: ['build', 'form'] },
    { id: 8, term: 'cause', type: 'verb', tags: ['make', 'work'] },
    { id: 9, term: 'originate', type: 'verb', tags: ['make', 'start'] },
    { id: 10, term: 'set up', type: 'verb', tags: ['start', 'establish'] },
  ]

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

  // Effect to determine if the screen is mobile based on window width
  /*useEffect(() => {
    const checkMobile = () => {
      // Tailwind's 'md' breakpoint is 768px. Assuming mobile is less than md.
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);*/

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


  // Filter words based on search term
  const filteredWords = words.filter((word: Word) =>
    word.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort words based on term and current sort order
  const sortedWords = [...filteredWords].sort((a: Word, b: Word) => {
    if (sortOrder === 'asc') {
      return a.term.localeCompare(b.term);
    } else {
      return b.term.localeCompare(a.term);
    }
  });

  // Toggle expanded row by ID and pass clicked word to parent
  const toggleRow = (word: Word) => {
    onRowClick(word); // Pass the entire word object to the parent

    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(word.id)) {
        return prevExpandedRows.filter((rowId) => rowId !== word.id);
      } else {
        return [...prevExpandedRows, word.id];
      }
    });
  };

  // Function to handle sorting
  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setShowSortDropdown(false); // Close the dropdown after selection
  };

  return (
    <div className="w-full max-w-2xl md:w-1/2 bg-gray-800 rounded-lg shadow-lg overflow-hidden min-h-[600px]">
      {/* Header with Search and Sort */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {/* Search Input */}
        <div className="relative flex items-center w-full max-w-sm mr-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          {/* Search Icon */}
          <span className="absolute left-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        {/* Sort Icon and Dropdown */}
        <div className="relative" ref={sortDropdownRef}> {/* Attach the ref here */}
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Sort"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 9.414V17a1 1 0 01-1.293.956l-2-1A1 1 0 017 15V9.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-42 bg-gray-700 rounded-md shadow-lg z-10 pt-2 pb-2">
              <button
                onClick={() => handleSort('asc')}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Alphabetically A-Z
              </button>
              <hr className="text-sm text-gray-600" />
              <button
                onClick={() => handleSort('desc')}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Alphabetically Z-A
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-700">
        {sortedWords.map((word: Word) => (
          <div key={word.id} className="group">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => toggleRow(word)}
            >
              {/* Status Indicator */}
              <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>
              {/* Word Term */}
              <div className="flex-1 text-left font-medium">{word.term}</div>
              {/* Word Type */}
              <div className="flex-none text-gray-400 text-sm mr-4">{word.type}</div>
              {/* Tags */}
              <div className="flex-none flex items-center space-x-2 mr-4">
                {word.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              {/* Expand/Collapse Icon */}
              <button
                className="p-1 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label={expandedRows.includes(word.id) ? "Collapse" : "Expand"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${expandedRows.includes(word.id) ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {/* Collapsible Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedRows.includes(word.id) ? 'max-h-screen opacity-100 p-4' : 'max-h-0 opacity-0'
              } bg-gray-700 text-gray-300 border-t border-gray-600`}
            >
              {/* You can add more detailed content here when a row is expanded */}
              <p>Details for &quot;{word.term}&quot; would go here.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};