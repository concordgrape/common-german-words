"use client";

import React, { useState, useEffect, useRef } from 'react';
import SortButton, { SortOption } from './SortButtons/Sort';

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
  selectedWord?: Word | null;
}

// WordTable component
export const WordTable: React.FC<WordTableProps> = ({ onRowClick, selectedWord }) => {
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
const words: Word[] = [
  { id: 11, term: 'improve', type: 'verb', tags: ['plan', 'modify'] },
  { id: 12, term: 'differentiate', type: 'verb', tags: ['maintain', 'validate'] },
  { id: 13, term: 'arrange', type: 'verb', tags: ['reorganize', 'reflect'] },
  { id: 14, term: 'implement', type: 'verb', tags: ['select', 'evaluate'] },
  { id: 15, term: 'adapt', type: 'verb', tags: ['define', 'understand'] },
  { id: 16, term: 'contribute', type: 'verb', tags: ['revise', 'complete'] },
  { id: 17, term: 'modify', type: 'verb', tags: ['arrange', 'translate'] },
  { id: 18, term: 'operate', type: 'verb', tags: ['introduce', 'represent'] },
  { id: 19, term: 'differentiate', type: 'verb', tags: ['include', 'realize'] },
  { id: 20, term: 'synthesize', type: 'verb', tags: ['enhance', 'provide'] },
  { id: 21, term: 'organize', type: 'verb', tags: ['research', 'plan'] },
  { id: 22, term: 'construct', type: 'verb', tags: ['assign', 'propose'] },
  { id: 23, term: 'research', type: 'verb', tags: ['demonstrate', 'initiate'] },
  { id: 24, term: 'submit', type: 'verb', tags: ['categorize', 'implement'] },
  { id: 25, term: 'optimize', type: 'verb', tags: ['summarize', 'translate'] },
  { id: 26, term: 'express', type: 'verb', tags: ['integrate', 'construct'] },
  { id: 27, term: 'modify', type: 'verb', tags: ['provide', 'display'] },
  { id: 28, term: 'monitor', type: 'verb', tags: ['differentiate', 'investigate'] },
  { id: 29, term: 'modify', type: 'verb', tags: ['facilitate', 'report'] },
  { id: 30, term: 'identify', type: 'verb', tags: ['identify', 'realize'] },
  { id: 31, term: 'include', type: 'verb', tags: ['operate', 'analyze'] },
  { id: 32, term: 'emphasize', type: 'verb', tags: ['develop', 'introduce'] },
  { id: 33, term: 'manage', type: 'verb', tags: ['structure', 'compose'] },
  { id: 34, term: 'provide', type: 'verb', tags: ['demonstrate', 'examine'] },
  { id: 35, term: 'design', type: 'verb', tags: ['structure', 'solve'] },
  { id: 36, term: 'maximize', type: 'verb', tags: ['modify', 'reassess'] },
  { id: 37, term: 'compose', type: 'verb', tags: ['simplify', 'realize'] },
  { id: 38, term: 'simplify', type: 'verb', tags: ['compile', 'recommend'] },
  { id: 39, term: 'analyze', type: 'verb', tags: ['integrate', 'compile'] },
  { id: 40, term: 'summarize', type: 'verb', tags: ['analyze', 'formulate'] },
  { id: 41, term: 'recommend', type: 'verb', tags: ['initiate', 'assign'] },
  { id: 42, term: 'translate', type: 'verb', tags: ['summarize', 'compose'] },
  { id: 43, term: 'plan', type: 'verb', tags: ['select', 'pursue'] },
  { id: 44, term: 'balance', type: 'verb', tags: ['validate', 'document'] },
  { id: 45, term: 'execute', type: 'verb', tags: ['complete', 'understand'] },
  { id: 46, term: 'summarize', type: 'verb', tags: ['prepare', 'emphasize'] },
  { id: 47, term: 'consider', type: 'verb', tags: ['resolve', 'prioritize'] },
  { id: 48, term: 'refine', type: 'verb', tags: ['reorganize', 'maintain'] },
  { id: 49, term: 'execute', type: 'verb', tags: ['submit', 'summarize'] },
  { id: 50, term: 'research', type: 'verb', tags: ['schedule', 'prepare'] },
  { id: 51, term: 'schedule', type: 'verb', tags: ['balance', 'update'] },
  { id: 52, term: 'solve', type: 'verb', tags: ['structure', 'manage'] },
  { id: 53, term: 'advance', type: 'verb', tags: ['categorize', 'compile'] },
  { id: 54, term: 'translate', type: 'verb', tags: ['produce', 'provide'] },
  { id: 55, term: 'interpret', type: 'verb', tags: ['summarize', 'represent'] },
  { id: 56, term: 'introduce', type: 'verb', tags: ['revise', 'connect'] },
  { id: 57, term: 'observe', type: 'verb', tags: ['update', 'support'] },
  { id: 58, term: 'propose', type: 'verb', tags: ['strategize', 'reflect'] },
  { id: 59, term: 'evaluate', type: 'verb', tags: ['discuss', 'organize'] },
  { id: 60, term: 'document', type: 'verb', tags: ['perform', 'introduce'] },
  { id: 61, term: 'calculate', type: 'verb', tags: ['understand', 'generate'] },
  { id: 62, term: 'summarize', type: 'verb', tags: ['analyze', 'execute'] },
  { id: 63, term: 'revise', type: 'verb', tags: ['optimize', 'differentiate'] },
  { id: 64, term: 'submit', type: 'verb', tags: ['understand', 'synthesize'] },
  { id: 65, term: 'integrate', type: 'verb', tags: ['emphasize', 'pursue'] },
  { id: 66, term: 'strategize', type: 'verb', tags: ['optimize', 'calculate'] },
  { id: 67, term: 'reorganize', type: 'verb', tags: ['deliver', 'represent'] },
  { id: 68, term: 'operate', type: 'verb', tags: ['facilitate', 'translate'] },
  { id: 69, term: 'synthesize', type: 'verb', tags: ['pursue', 'include'] },
  { id: 70, term: 'negotiate', type: 'verb', tags: ['represent', 'arrange'] },
  { id: 71, term: 'execute', type: 'verb', tags: ['enhance', 'synthesize'] },
  { id: 72, term: 'suggest', type: 'verb', tags: ['advance', 'reassess'] },
  { id: 73, term: 'calculate', type: 'verb', tags: ['arrange', 'reflect'] },
  { id: 74, term: 'negotiate', type: 'verb', tags: ['simplify', 'discuss'] },
  { id: 75, term: 'facilitate', type: 'verb', tags: ['connect', 'revise'] },
  { id: 76, term: 'evaluate', type: 'verb', tags: ['emphasize', 'pursue'] },
  { id: 77, term: 'modify', type: 'verb', tags: ['calculate', 'propose'] },
  { id: 78, term: 'observe', type: 'verb', tags: ['outline', 'solve'] },
  { id: 79, term: 'resolve', type: 'verb', tags: ['observe', 'improve'] },
  { id: 80, term: 'research', type: 'verb', tags: ['investigate', 'pursue'] },
  { id: 81, term: 'improve', type: 'verb', tags: ['categorize', 'verify'] },
  { id: 82, term: 'maintain', type: 'verb', tags: ['observe', 'edit'] },
  { id: 83, term: 'reorganize', type: 'verb', tags: ['differentiate', 'suggest'] },
  { id: 84, term: 'upgrade', type: 'verb', tags: ['propose', 'research'] },
  { id: 85, term: 'reflect', type: 'verb', tags: ['refine', 'design'] },
  { id: 86, term: 'complete', type: 'verb', tags: ['realize', 'publish'] },
  { id: 87, term: 'translate', type: 'verb', tags: ['design', 'calculate'] },
  { id: 88, term: 'understand', type: 'verb', tags: ['modify', 'emphasize'] },
  { id: 89, term: 'differentiate', type: 'verb', tags: ['propose', 'understand'] },
  { id: 90, term: 'structure', type: 'verb', tags: ['deliver', 'design'] },
  { id: 91, term: 'balance', type: 'verb', tags: ['understand', 'connect'] },
  { id: 92, term: 'reassess', type: 'verb', tags: ['interpret', 'integrate'] },
  { id: 93, term: 'prepare', type: 'verb', tags: ['implement', 'enhance'] },
  { id: 94, term: 'prioritize', type: 'verb', tags: ['complete', 'review'] },
  { id: 95, term: 'suggest', type: 'verb', tags: ['include', 'document'] },
  { id: 96, term: 'display', type: 'verb', tags: ['initiate', 'demonstrate'] },
  { id: 97, term: 'operate', type: 'verb', tags: ['maximize', 'reassess'] },
  { id: 98, term: 'display', type: 'verb', tags: ['recommend', 'adapt'] },
  { id: 99, term: 'visualize', type: 'verb', tags: ['contribute', 'validate'] },
  { id: 100, term: 'pursue', type: 'verb', tags: ['collaborate', 'develop'] },
  { id: 101, term: 'integrate', type: 'verb', tags: ['manage', 'revise'] },
  { id: 102, term: 'complete', type: 'verb', tags: ['connect', 'reassess'] },
  { id: 103, term: 'balance', type: 'verb', tags: ['understand', 'update'] },
  { id: 104, term: 'explore', type: 'verb', tags: ['arrange', 'perform'] },
  { id: 105, term: 'examine', type: 'verb', tags: ['perform', 'monitor'] },
  { id: 106, term: 'analyze', type: 'verb', tags: ['collaborate', 'summarize'] },
  { id: 107, term: 'implement', type: 'verb', tags: ['synthesize', 'select'] },
  { id: 108, term: 'integrate', type: 'verb', tags: ['enhance', 'modify'] },
  { id: 109, term: 'differentiate', type: 'verb', tags: ['design', 'compose'] },
  { id: 110, term: 'develop', type: 'verb', tags: ['integrate', 'refine'] },
  { id: 111, term: 'identify', type: 'verb', tags: ['calculate', 'pursue'] },
  { id: 112, term: 'edit', type: 'verb', tags: ['explore', 'prepare'] },
  { id: 113, term: 'compose', type: 'verb', tags: ['structure', 'organize'] },
  { id: 114, term: 'investigate', type: 'verb', tags: ['refine', 'generate'] },
  { id: 115, term: 'document', type: 'verb', tags: ['develop', 'investigate'] },
  { id: 116, term: 'outline', type: 'verb', tags: ['manage', 'submit'] },
  { id: 117, term: 'refine', type: 'verb', tags: ['select', 'strategize'] },
  { id: 118, term: 'document', type: 'verb', tags: ['enhance', 'synthesize'] },
  { id: 119, term: 'enhance', type: 'verb', tags: ['support', 'review'] },
  { id: 120, term: 'evaluate', type: 'verb', tags: ['prioritize', 'reorganize'] },
  { id: 121, term: 'formulate', type: 'verb', tags: ['enhance', 'create'] },
  { id: 122, term: 'connect', type: 'verb', tags: ['differentiate', 'compile'] },
  { id: 123, term: 'demonstrate', type: 'verb', tags: ['examine', 'define'] },
  { id: 124, term: 'visualize', type: 'verb', tags: ['reorganize', 'advance'] },
  { id: 125, term: 'prioritize', type: 'verb', tags: ['design', 'evaluate'] },
  { id: 126, term: 'record', type: 'verb', tags: ['update', 'maintain'] },
  { id: 127, term: 'explore', type: 'verb', tags: ['pursue', 'compile'] },
  { id: 128, term: 'calculate', type: 'verb', tags: ['collaborate', 'improve'] },
  { id: 129, term: 'assign', type: 'verb', tags: ['summarize', 'execute'] },
  { id: 130, term: 'verify', type: 'verb', tags: ['structure', 'consider'] },
  { id: 131, term: 'prioritize', type: 'verb', tags: ['compose', 'submit'] },
  { id: 132, term: 'develop', type: 'verb', tags: ['plan', 'compose'] },
  { id: 133, term: 'analyze', type: 'verb', tags: ['facilitate', 'differentiate'] },
  { id: 134, term: 'generate', type: 'verb', tags: ['reorganize', 'evaluate'] },
  { id: 135, term: 'advance', type: 'verb', tags: ['contribute', 'adapt'] },
  { id: 136, term: 'reassess', type: 'verb', tags: ['execute', 'optimize'] },
  { id: 137, term: 'differentiate', type: 'verb', tags: ['differentiate', 'connect'] },
  { id: 138, term: 'develop', type: 'verb', tags: ['facilitate', 'observe'] },
  { id: 139, term: 'update', type: 'verb', tags: ['suggest', 'modify'] },
  { id: 140, term: 'analyze', type: 'verb', tags: ['maximize', 'synthesize'] },
  { id: 141, term: 'adapt', type: 'verb', tags: ['verify', 'select'] },
  { id: 142, term: 'visualize', type: 'verb', tags: ['synthesize', 'analyze'] },
  { id: 143, term: 'submit', type: 'verb', tags: ['interpret', 'integrate'] },
  { id: 144, term: 'strategize', type: 'verb', tags: ['generate', 'construct'] },
  { id: 145, term: 'consider', type: 'verb', tags: ['deliver', 'compile'] },
  { id: 146, term: 'structure', type: 'verb', tags: ['complete', 'formulate'] },
  { id: 147, term: 'interpret', type: 'verb', tags: ['document', 'strategize'] },
  { id: 148, term: 'refine', type: 'verb', tags: ['visualize', 'explore'] },
  { id: 149, term: 'define', type: 'verb', tags: ['adapt', 'perform'] },
  { id: 150, term: 'evaluate', type: 'verb', tags: ['publish', 'prepare'] },
  { id: 151, term: 'plan', type: 'verb', tags: ['select', 'display'] },
  { id: 152, term: 'arrange', type: 'verb', tags: ['record', 'produce'] },
  { id: 153, term: 'review', type: 'verb', tags: ['discuss', 'pursue'] },
  { id: 154, term: 'plan', type: 'verb', tags: ['refine', 'contribute'] },
  { id: 155, term: 'verify', type: 'verb', tags: ['visualize', 'consider'] },
  { id: 156, term: 'edit', type: 'verb', tags: ['modify', 'support'] },
  { id: 157, term: 'review', type: 'verb', tags: ['examine', 'arrange'] },
  { id: 158, term: 'evaluate', type: 'verb', tags: ['develop', 'integrate'] },
  { id: 159, term: 'design', type: 'verb', tags: ['initiate', 'differentiate'] },
  { id: 160, term: 'refine', type: 'verb', tags: ['execute', 'publish'] },
  { id: 161, term: 'simplify', type: 'verb', tags: ['connect', 'express'] },
  { id: 162, term: 'display', type: 'verb', tags: ['categorize', 'validate'] },
  { id: 163, term: 'recommend', type: 'verb', tags: ['publish', 'reflect'] },
  { id: 164, term: 'outline', type: 'verb', tags: ['prioritize', 'collaborate'] },
  { id: 165, term: 'perform', type: 'verb', tags: ['improve', 'formulate'] },
  { id: 166, term: 'verify', type: 'verb', tags: ['evaluate', 'reorganize'] },
  { id: 167, term: 'display', type: 'verb', tags: ['produce', 'visualize'] },
  { id: 168, term: 'reassess', type: 'verb', tags: ['execute', 'investigate'] },
  { id: 169, term: 'manage', type: 'verb', tags: ['differentiate', 'categorize'] },
  { id: 170, term: 'revise', type: 'verb', tags: ['recommend', 'reassess'] },
  { id: 171, term: 'simplify', type: 'verb', tags: ['manage', 'publish'] },
  { id: 172, term: 'synthesize', type: 'verb', tags: ['enhance', 'connect'] },
  { id: 173, term: 'select', type: 'verb', tags: ['propose', 'record'] },
  { id: 174, term: 'negotiate', type: 'verb', tags: ['perform', 'publish'] },
  { id: 175, term: 'contribute', type: 'verb', tags: ['calculate', 'simplify'] },
  { id: 176, term: 'adapt', type: 'verb', tags: ['maximize', 'categorize'] },
  { id: 177, term: 'produce', type: 'verb', tags: ['advance', 'perform'] },
  { id: 178, term: 'implement', type: 'verb', tags: ['create', 'operate'] },
  { id: 179, term: 'consider', type: 'verb', tags: ['demonstrate', 'refine'] },
  { id: 180, term: 'analyze', type: 'verb', tags: ['validate', 'collaborate'] },
  { id: 181, term: 'contribute', type: 'verb', tags: ['understand', 'complete'] },
  { id: 182, term: 'resolve', type: 'verb', tags: ['simplify', 'translate'] },
  { id: 183, term: 'document', type: 'verb', tags: ['facilitate', 'balance'] },
  { id: 184, term: 'adapt', type: 'verb', tags: ['improve', 'enhance'] },
  { id: 185, term: 'assign', type: 'verb', tags: ['propose', 'formulate'] },
  { id: 186, term: 'reflect', type: 'verb', tags: ['implement', 'propose'] },
  { id: 187, term: 'summarize', type: 'verb', tags: ['submit', 'research'] },
  { id: 188, term: 'reassess', type: 'verb', tags: ['investigate', 'upgrade'] },
  { id: 189, term: 'recommend', type: 'verb', tags: ['complete', 'integrate'] },
  { id: 190, term: 'validate', type: 'verb', tags: ['evaluate', 'understand'] },
  { id: 191, term: 'manage', type: 'verb', tags: ['summarize', 'analyze'] },
  { id: 192, term: 'modify', type: 'verb', tags: ['understand', 'strategize'] },
  { id: 193, term: 'verify', type: 'verb', tags: ['monitor', 'produce'] },
  { id: 194, term: 'compile', type: 'verb', tags: ['collaborate', 'structure'] },
  { id: 195, term: 'facilitate', type: 'verb', tags: ['discuss', 'plan'] },
  { id: 196, term: 'differentiate', type: 'verb', tags: ['complete', 'support'] },
  { id: 197, term: 'operate', type: 'verb', tags: ['collaborate', 'complete'] },
  { id: 198, term: 'manage', type: 'verb', tags: ['compose', 'connect'] },
  { id: 199, term: 'introduce', type: 'verb', tags: ['plan', 'differentiate'] },
  { id: 200, term: 'solve', type: 'verb', tags: ['connect', 'construct'] },
  { id: 201, term: 'balance', type: 'verb', tags: ['display', 'translate'] },
  { id: 202, term: 'assign', type: 'verb', tags: ['connect', 'reassess'] },
  { id: 203, term: 'solve', type: 'verb', tags: ['execute', 'balance'] },
  { id: 204, term: 'develop', type: 'verb', tags: ['maintain', 'enhance'] },
  { id: 205, term: 'verify', type: 'verb', tags: ['investigate', 'interpret'] },
  { id: 206, term: 'examine', type: 'verb', tags: ['implement', 'compile'] },
  { id: 207, term: 'contribute', type: 'verb', tags: ['structure', 'compile'] },
  { id: 208, term: 'translate', type: 'verb', tags: ['categorize', 'execute'] },
  { id: 209, term: 'schedule', type: 'verb', tags: ['compile', 'investigate'] },
  { id: 210, term: 'reassess', type: 'verb', tags: ['enhance', 'schedule'] }
];

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
    setExpandedRows([words[0].id]);
  }
}, [selectedWord]);



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

  useEffect(() => {
  if (selectedWord && !expandedRows.includes(selectedWord.id)) {
    setExpandedRows([selectedWord.id]);
  } else {
    setExpandedRows([words[0].id]);
  }
}, [selectedWord]);


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
    <div className="w-full sm:max-w-lg md:max-w-lg lg:max-w-xl items-start bg-black/40 rounded-lg shadow-lg overflow-hidden mt-5">
        {/* Header with Search and Sort */}
        <div className="p-4 border-b border-gray-700">
            {/* Search Input */}
            <div className="relative flex items-center w-full mb-4">
                <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex justify-end" ref={sortDropdownRef}>
                <div className="relative">
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="p-2 rounded-full bg-black/20 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        aria-label="Sort">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 9.414V17a1 1 0 01-1.293.956l-2-1A1 1 0 017 15V9.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {showSortDropdown && (
                        <div className="absolute right-0 mt-2 w-42 bg-gray-700 rounded-md shadow-lg z-10 pt-2 pb-2">
                            <button
                                onClick={() => handleSort('asc')}
                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black/20"
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
        </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-700">
        {sortedWords.map((word: Word) => (
          <div
            key={word.id}
            ref={(el) => {
                wordRefs.current[word.id] = el;
            }}
            className="group"
            >
            <div
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 transition-colors duration-200 ${expandedRows.includes(word.id) ? 'bg-white/20' : ''}`}
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
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${expandedRows.includes(word.id) ? '-rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div
              className={`overflow-hidden ${
                expandedRows.includes(word.id) ? 'max-h-screen opacity-100 p-4' : 'max-h-0 opacity-0'
              } bg-gray-700 text-gray-300 border-t border-gray-600 visible sm:hidden md:hidden`}
            >
              <p>Details for &quot;{word.term}&quot; would go here.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};