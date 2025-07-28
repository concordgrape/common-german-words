"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import SortButton, { SortOption } from "./SortButtons/Sort";
import { Virtuoso } from "react-virtuoso";
import { Word } from "../helpers/fetchBasicWordList";
import { useSearchParams, useRouter } from "next/navigation";
import { truncateString, useIsMobile } from "../helpers/utils";
import { FaQuestionCircle } from "react-icons/fa";
import { FaArrowDownShortWide } from "react-icons/fa6";
import { DropdownWordInfo } from "./DropdownWordInfo";
import { useToast } from "../hooks/useToast";
import WordPopover from "./Popover/Popover";
import WordStatusButtons from "./WordStatusButtons/WordStatusButtons";
import {
  fetchWordStatusData,
  useToggleWordStatus,
} from "../helpers/userWordLibrary";
import { useUser } from "../context/UserContext";

// WordTable component props interface
interface WordTableProps {
  onRowClick: (word: Word | null) => void;
  selectedWord?: Word | null;
  words: Word[];
}

const ITEMS_PER_PAGE = 100;

// WordTable component
export const WordTable: React.FC<WordTableProps> = ({
  onRowClick,
  selectedWord,
  words,
}) => {
  // State to manage expanded rows, explicitly typed to an array of numbers
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [pendingSaved, setPendingSaved] = useState<Set<string>>(new Set());
  const [pendingKnown, setPendingKnown] = useState<Set<string>>(new Set());

  // State to detect if the current view is mobile
  //const [isMobile, setIsMobile] = useState<boolean>(false);
  // State to manage the visibility of the sort dropdown
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isReversed, setIsReversed] = useState(false);
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());
  const [knownWordIds, setKnownWordIds] = useState<Set<string>>(new Set());
  const [savedTimestamps, setSavedTimestamps] = useState<Map<string, number>>(new Map());
  const [knownTimestamps, setKnownTimestamps] = useState<Map<string, number>>(new Map());

  const [activeSort, setActiveSort] = useState<SortOption["id"]>("frequency"); // 'alphabetically' is active by default as per screenshot
  const [selectedCEFR, setSelectedCEFR] = useState<
    "All" | "A1" | "A2" | "B1"
  >("All");

  // Create a ref for the dropdown container
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useUser();

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  // Adjust Virtuoso height
  const isMobile = useIsMobile();
  const rowHeight = 45;

  const scoredWords = words
    .map((word) => {
      const lowerSearch = searchTerm.toLowerCase();
      const wordText = word.word.toLowerCase();
      const translationText = word.translation?.toLowerCase() || "";
      let score = 0;

      // Check both word and translation
      const matchesWord = wordText.includes(lowerSearch);
      const matchesTranslation = translationText.includes(lowerSearch);

      if (wordText === lowerSearch || translationText === lowerSearch) {
        score = 3; // exact match
      } else if (
        wordText.startsWith(lowerSearch) ||
        translationText.startsWith(lowerSearch)
      ) {
        score = 2; // prefix match
      } else if (matchesWord || matchesTranslation) {
        score = 1; // partial match
      }

      return { ...word, _score: score };
    })
    .filter((word) => word._score > 0);


  // Then sort by relevance score first, then by word
  let sortedWords = scoredWords.sort((a, b) => {
    if (activeSort === "frequency") {
      return b.frequency - a.frequency;
    }

    if (activeSort === "alphabetically") {
      return a.word.localeCompare(b.word);
    }

    if (activeSort === "my-saved") {
      return (
        (savedTimestamps.get(b.word) ?? 0) -
        (savedTimestamps.get(a.word) ?? 0)
      );
    }

    if (activeSort === "my-known") {
      return (
        (knownTimestamps.get(b.word) ?? 0) -
        (knownTimestamps.get(a.word) ?? 0)
      );
    }

    return 0;
  });

  const filteredWords = useMemo(() => {
    let result = sortedWords;

    if (selectedType !== "All") {
      result = result.filter(
        (word) =>
          word.part_of_speech?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedCEFR === "A1") {
      result = result.filter((word) => word.rank === 1);
    } else if (selectedCEFR === "A2") {
      result = result.filter((word) => word.rank === 2);
    } else if (selectedCEFR === "B1") {
      result = result.filter((word) => word.rank === 3);
    }

    return result;
  }, [selectedType, selectedCEFR, sortedWords]);

  // Only show paginated results if not filtering
  const displayedWords = filteredWords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const wordTypes = [
    "All",
    "Verb",
    "Adjective",
    "Noun",
    "Interjection",
    "Adverb",
    "Determiner",
  ];

  //const [checkEnabledById, setCheckEnabledById] = useState<Record<number, boolean>>({});
  //const [plusEnabledById, setPlusEnabledById] = useState<Record<number, boolean>>({});

  const { toggleSavedStatus, toggleKnownStatus } = useToggleWordStatus();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
  const height =
    displayedWords.length * rowHeight +
    (isMobile && expandedRows.length > 0 ? 435 : 0) +
    44;

  setVirtuosoHeight(`${height}px`);
}, [displayedWords.length, expandedRows.length, isMobile]);

  useEffect(() => {
    const fetchStatusData = async () => {
      if (!user?.uid) return;

      try {
        const [saved, known] = await Promise.all([
          fetchWordStatusData(user.uid, "saved", 5000),
          fetchWordStatusData(user.uid, "known", 5000),
        ]);

        setSavedWordIds(new Set(saved.map((doc) => doc.id)));
        setKnownWordIds(new Set(known.map((doc) => doc.id)));

        setSavedTimestamps(
          new Map(saved.map((doc) => [doc.id, doc.timestamp.toMillis()]))
        );
        setKnownTimestamps(
          new Map(known.map((doc) => [doc.id, doc.timestamp.toMillis()]))
        );
      } catch (err) {
        console.error("❌ Error preloading word status:", err);
      }
    };

    fetchStatusData();
  }, [user?.uid]);

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
          bounding.top >= 0 && bounding.bottom <= window.innerHeight;

        const partiallyInView =
          bounding.top < window.innerHeight && bounding.bottom >= 0;

        if (!partiallyInView && fullyInView) {
          ref.scrollIntoView({ behavior: "smooth", block: "center" });
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
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or showSortDropdown changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]); // Re-run effect when showSortDropdown changes

  useEffect(() => {
    if (selectedWord && !expandedRows.includes(selectedWord.id)) {
      setExpandedRows([selectedWord.id]);
    }
  }, [selectedWord]);

  if (isReversed) {
    sortedWords = [...sortedWords].reverse();
  }

  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);

  const initialHeight =
    displayedWords.length * rowHeight +
    (isMobile && expandedRows.length > 0 ? 435 : 0) +
    45;

  const [virtuosoHeight, setVirtuosoHeight] = useState<string>(`${initialHeight}px`);



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
    { id: "frequency", label: "by frequency" },
    { id: "alphabetically", label: "alphabetically" },
    { id: "my-saved", label: "saved words" },
    { id: "my-known", label: "known words" },
  ];

  // Type for the handler function
  const handleSortChange = (optionId: SortOption["id"]) => {
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

  const handlePlusClick = async (word: string) => {
    try {
      await toggleSavedStatus(word);

      setSavedWordIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(word)) {
          newSet.delete(word);
        } else {
          newSet.add(word);
        }
        return newSet;
      });
    } catch (err) {
      console.error("❌ Error toggling saved status:", err);
    }
  };

  const handleCheckClick = async (word: string) => {
    try {
      await toggleKnownStatus(word);

      setKnownWordIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(word)) {
          newSet.delete(word);
        } else {
          newSet.add(word);
        }
        return newSet;
      });
    } catch (err) {
      console.error("❌ Error toggling known status:", err);
    }
  };

  const CustomScroller = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} {...props} />
  ));
  CustomScroller.displayName = "CustomScroller";

  return (
    <div
      className={`w-full max-w-[800px] p-1 sm:p-4 md:p-4 items-start bg-[#FFFFFF] dark:bg-[#181922] border-1 border-gray-200 dark:border-gray-700 overflow-hidden mt-5`}
    >
      {/* Header with Search and Sort border border-1 border-[#B1B1B1]*/}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-2 rounded bg-gray-200 text-black dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 border border-1 border-gray-300 dark:border-gray-600"
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

          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 rounded bg-gray-200 text-black dark:text-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 border border-1 border-gray-300 dark:border-gray-600"            
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
            className="pl-9 w-full pr-4 py-2 rounded-sm bg-[#F2F2F2] dark:bg-[#3E3F53] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-600 border border-gray-200 dark:border-gray-700 border-1"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Sort Buttons Row */}
        <div className="flex justify-center mb-5">
          <div className="flex lg:flex-wrap justify-center gap-2 lg:gap-10 items-start w-full">
            {/* CEFR Level Buttons */}
            <div className="flex flex-col items-start">
              <span className="mb-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                Filter by Level
              </span>
                <div className="grid grid-cols-2 gap-0 text-lg lg:w-50 border border-1 border-gray-200 dark:border-gray-600 rounded-lg">                
                {[
                  { id: "All", label: "All" },
                  { id: "A1", label: "A1" },
                  { id: "A2", label: "A2" },
                  { id: "B1", label: "B1" },
                ].map((option, index) => (
                  <SortButton
                    key={option.id}
                    label={option.label}
                    isActive={selectedCEFR === option.id}
                    onClick={() =>
                      setSelectedCEFR(
                        option.id as "All" | "A1" | "A2" | "B1"
                      )
                    }
                    index={index}
                    color={"bg-orange-400"}
                  />
                ))}
              </div>
              <div className="flex flex-col items-start mt-5 w-full">
                <span className="mb-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Part of Speech
                </span>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 cursor-pointer text-sm col-span-2 w-full border border-1 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white"
                  id="partOfSpeechSelect"
                >
                  {wordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort + Part of Speech Filter */}
            <div className="flex flex-col items-start">
              <span className="mb-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                Sort & Type
              </span>
              <div className="grid grid-cols-2 gap-0 w-full lg:w-80 max-w-[300px] lg:max-w-[400px] lg:max-w-[350px] border border-1 border-gray-200 dark:border-gray-600 rounded-lg">
                {sortOptions.map((option, index) => (
                  <SortButton
                    key={option.id}
                    label={option.label}
                    isActive={activeSort === option.id}
                    onClick={() => handleSortChange(option.id)}
                    index={index}
                    color={"bg-gray-500 dark:bg-gray-300"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-left font-mono">
          <span className="font-extrabold text-xl text-blue-500">{filteredWords.length}</span>
          <br />
          <span className="text-sm text-black dark:text-gray-200">
            {filteredWords.length != 1
            ? selectedType != "All"
              ? `${selectedType.toLowerCase()}s`
              : "words"
            : "word"}{" "}
            loaded
          </span>
        </div>
      </div>
        <div className="flex px-4 py-2 bg-[#F9F9F9] dark:bg-gray-700 text-gray-600 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-600 text-sm z-1">
        {/*<div className="w-2 mr-2"></div>*/}
        {/*<div className="w-5">#</div>*/}
        <div className="ml-0">Word</div>
        <div className="text-center flex-1 ml-10 mr-5">Translation</div>
        <div className="relative group w-fit flex items-center gap-1 mr-1 lg:mr-0">
          <span>Rank</span>
          <FaQuestionCircle className="text-gray-400  hidden sm:block md:block" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            Frequency rank (1 is most common)
          </div>
        </div>
        <div className="w-[70px] sm:w-[80px] md:w-[80px]"></div>
        <button
          className="cursor-pointer hover:text-gray-400 w-5"
          onClick={() => setIsReversed((prev) => !prev)}
          aria-label="Toggle sort order"
        >
          <FaArrowDownShortWide
            className={`${
              isReversed ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button>
      </div>
      {displayedWords.length === 0 && searchTerm && (
        <div>
          <h1 className="mt-5 mb-2">{`'${searchTerm}' not found, example words:`}</h1>
          <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm">
            haus
          </button>
          <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm ml-2">
            gehen
          </button>
          <button className="text-blue-500 bg-blue-200 py-2 px-4 rounded-sm ml-2">
            das
          </button>
        </div>
      )}
      {/* Table Rows */}
      {displayedWords.length === 0 && words.length === 0 ? (
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
          itemContent={(localIndex, word) => {
            return (
              <div
                key={word.id}
                ref={(el) => {
                  wordRefs.current[word.id] = el;
                }}
                className={`border-1 font-arial  ${
                  expandedRows.includes(word.id)
                    ? "border-blue-300 lg:max-h-[44px] sm:max-h-[44px] md:max-h-[44px]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-[#F2F2F2] dark:border-gray-600 h-[44px] max-h-[44px]"                
                  }`}
              >
                <div
                  className={`flex items-center justify-between py-[5px] px-2 sm:p-3 md:p-3 lg:p-3 cursor-pointer transition-colors duration-200 ${
                    expandedRows.includes(word.id) ? "" : ""
                  }`}
                  onClick={() => {
                    toggleRow(word);
                  }}
                >
                  {/* Status Indicator 
        <span className="h-2 w-2 rounded-full bg-green-500 mr-3"></span>*/}
                  {/*<span className="mr-3 text-gray-400">{index}</span>*/}

                  {/* Word Term */}
                  <div className="text-left text-black dark:text-white font-medium px-1 rounded-sm flex items-center gap-1">
                    {/* Hover trigger isolated to just the word */}
                    <span className="relative group inline-block">
                      <span className="hover:bg-gray-200 rounded-sm px-0.5 cursor-pointer">
                        {word.word}
                      </span>
                      {/* Popover only visible when hovering the word */}
                      <WordPopover word={word.word} />
                    </span>

                    {/* Gender suffix (not hoverable) */}
                    {word.part_of_speech?.toLowerCase() !== "determiner" && (
                      <>
                        {word.gender.toLowerCase() === "masculine" && (
                          <span className="text-gray-700 dark:text-gray-400 text-sm italic">
                            , der
                          </span>
                        )}
                        {word.gender.toLowerCase() === "feminine" && (
                          <span className="text-gray-700 dark:text-gray-400 text-sm italic">
                            , die
                          </span>
                        )}
                        {word.gender.toLowerCase() === "neuter" && (
                          <span className="text-gray-700 dark:text-gray-400 text-sm italic">
                            , das
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Translation */}
                  <div className="flex-1 pl-10 text-center font-medium text-gray-500 dark:text-gray-400">
                    <i>
                      {truncateString(
                        word.translation,
                        isMobile ? (word.word.length > 8 ? 5 : 15) : 30
                      )}
                    </i>
                  </div>

                  <div className="w-[10px] sm:w-[40px] md:w-[40px] text-center text-gray-400 text-sm mr-9">
                    {word.rank}
                  </div>

                  {/* Word Type */}
                  {/*<div className="w-[60px] sm:w-[80px] md:w-[80px] text-right text-gray-400 text-sm mr-4">
  {word.part_of_speech}
</div>*/}

                  {/* Expand/Collapse Icon */}
                  {/*<button
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
        </button>*/}

                  <WordStatusButtons
                    //word={word}
                    isPlusEnabled={
                      pendingSaved.has(word.word)
                        ? !savedWordIds.has(word.word) // optimistically flipped
                        : savedWordIds.has(word.word)
                    }
                    isCheckEnabled={
                      pendingKnown.has(word.word)
                        ? !knownWordIds.has(word.word)
                        : knownWordIds.has(word.word)
                    }
                    onPlusClick={(e) => {
                      e.stopPropagation();

                      setPendingSaved((prev) => new Set(prev).add(word.word));

                      handlePlusClick(word.word).finally(() => {
                        setPendingSaved((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(word.word);
                          return newSet;
                        });
                        if (!user) { return; }
                        toast({
                          title: savedWordIds.has(word.word)
                            ? "Removed from Saved"
                            : "Added to Saved",
                          subtitle: `'${word.word}' ${
                            savedWordIds.has(word.word)
                              ? "removed from"
                              : "added to"
                          } saved words`,
                          variant: "known",
                        });
                      });
                    }}
                    onCheckClick={(e) => {
                      e.stopPropagation();

                      setPendingKnown((prev) => new Set(prev).add(word.word));

                      handleCheckClick(word.word).finally(() => {
                        setPendingKnown((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(word.word);
                          return newSet;
                        });
                        if (!user) { return; }
                        toast({
                          title: knownWordIds.has(word.word)
                            ? "Removed from Known"
                            : "Added to Known",
                          subtitle: `'${word.word}' ${
                            knownWordIds.has(word.word)
                              ? "removed from"
                              : "added to"
                          } known words`,
                          variant: "success",
                        });
                      });
                    }}
                  />
                </div>

                <div
                  className={`transition-max-height overflow-hidden bg-[#027AFB] text-white visible sm:hidden md:hidden ${
                    expandedRows.includes(word.id)
                      ? "opacity-100 p-4"
                      : "opacity-0 p-0"
                  }`}
                >
                  <DropdownWordInfo
                    word={word}
                    isOpen={expandedRows.includes(word.id)}
                  />
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};
