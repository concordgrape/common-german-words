'use client';

import { FaCheck } from 'react-icons/fa';
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useIsMobile } from '@/app/helpers/utils';

interface WordStatusButtonsProps {
  isPlusEnabled: boolean;
  isCheckEnabled: boolean;
  onPlusClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCheckClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  large?: boolean; // ✅ NEW prop
}

export default function WordStatusButtons({
  isPlusEnabled,
  isCheckEnabled,
  onPlusClick,
  onCheckClick,
  large = false, // ✅ Default to false
}: WordStatusButtonsProps) {
  const isMobile = useIsMobile();

  // ✅ Dynamically calculate icon size
  const iconSize = large ? (isMobile ? 20 : 22) : (isMobile ? 14 : 13);
  const checkSize = large ? (isMobile ? 18 : 20) : (isMobile ? 12 : 10);

  const baseButtonSize = large ? "w-10 h-10" : "w-8 h-8 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-6 lg:w-6";

  return (
    <div className="flex gap-1 items-center">
      {/* Save / Bookmark Button */}
      <div
        data-tip="Save Word"
        className={`tooltip relative group ${baseButtonSize} mr-2`}
      >
        <button
          className={`w-full h-full transition-colors duration-300 ${
            isPlusEnabled
              ? 'bg-orange-400 text-white'
              : 'bg-gray-100 dark:bg-gray-500 dark:text-gray-200 text-black'
          } rounded-sm hover:bg-orange-400 hover:text-white cursor-pointer`}
          onClick={onPlusClick}
        >
          {isPlusEnabled ? (
            <FaBookmark className="m-auto" size={iconSize} />
          ) : (
            <FaRegBookmark className="m-auto" size={iconSize} />
          )}
        </button>
      </div>

      {/* Known / Checkmark Button */}
      <button
        data-tip="Known Word"
        className={`tooltip ${baseButtonSize} transition-colors duration-300 ${
          isCheckEnabled
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 dark:bg-gray-500 dark:text-gray-200'
        } rounded-sm hover:bg-green-500 hover:text-white cursor-pointer`}
        onClick={onCheckClick}
      >
        <FaCheck className="m-auto" size={checkSize} />
      </button>
    </div>
  );
}
